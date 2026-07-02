import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Ip,
	Param,
	Post,
	UseFilters
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { OnEvent } from '@nestjs/event-emitter'
import { Payload } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { UserResponseMessages } from 'ResponseMessages/user.response.messages'
import Result from 'src/Common/Application/Result'
import { HttpExceptionFilter } from 'src/Common/Infrastructure/Output/HttpExceptionFilter'
import { ConfirmVerificationEmailCommand } from 'src/User/Application/Commands/ConfirmVerificationEmailCommand'
import { RegisterCommand } from 'src/User/Application/Commands/RegisterCommand'
import { LoginQuery } from 'src/User/Application/Queries/LoginQuery'
import { LoginDTO } from 'src/User/Infrastructure/Input/HTTP/Dto/LoginDTO'
import { RegisterDTO } from 'src/User/Infrastructure/Input/HTTP/Dto/ReginsterDTO'

@UseFilters(HttpExceptionFilter)
@ApiTags('Authentication')
@Controller('auth')
export default class UserController {
	public constructor(
		private commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Post('/register')
	public async registerNewUser(@Body() registerCommand: RegisterDTO, @Ip() ip: string) {
		await this.commandBus.execute<RegisterCommand, void>(
			new RegisterCommand(
				registerCommand.email,
				registerCommand.password,
				registerCommand.confirmPassword,
				registerCommand.name,
				ip
			)
		)
		return {
			message: UserResponseMessages.VERIFICATION_EMAIL_SENT
		}
	}

	@Get('/:token')
	public async confirmVerificationEmail(@Param('token') token: string) {
		await this.commandBus.execute<ConfirmVerificationEmailCommand, Result<void>>(
			new ConfirmVerificationEmailCommand(token)
		)

		return {
			message: UserResponseMessages.EMAIL_VERIFIED
		}
	}
	@Post('/login')
	public async login(@Body() loginQuery: LoginDTO): Promise<{ token: string }> {
		const t = await this.queryBus.execute<LoginQuery, string>(
			new LoginQuery(loginQuery.email, loginQuery.password)
		)

		return { token: t }
	}

	// @Get("/VerifyEmailAddress/:emailVerificationToken")
	// public async verifyEmailAddress(@Param() emailVerificationToken: VerifyEmailAddressCommand): Promise<void>
	// {
	//     return this._verifyEmailAddressInputPort.handle(emailVerificationToken);
	// }
	// @Get("test")
	// public async test(): Promise<void>
	// {
	//     const token = await this._tokenService.signAndEncrypt(JSON.stringify({ name: "bahman" }), "AUTH", 5);

	//     console.log(token);
	// }
	//
}
