import Result from 'src/Common/Application/Result'
import { LoginQuery } from 'src/User/Application/Queries/LoginQuery'
import { Login } from 'src/User/Application/UseCases/Login'
import { TokenService } from 'src/Common/Application/Output/TokenService'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository'
import Email from 'src/User/Domain/Email'
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UserResponseMessages } from 'ResponseMessages/user.response.messages'
import { HashService } from 'src/Common/Application/Output/HashService'
import Password from 'src/User/Domain/Password'
import Notification from 'src/Common/Application/Notification'
import { UserStatus } from '@prisma/client'
import { InValidOperationException } from 'src/Common/Domain/Exceptions/InValidOperationException'

@QueryHandler(LoginQuery)
export default class LoginImpl implements IQueryHandler<LoginQuery, string> {
	constructor(
		@Inject(TokenService) private readonly tokenService: TokenService,
		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(HashService) private readonly hashService: HashService
	) {}

	async execute(query: LoginQuery): Promise<string> {
		const resultEmail = Email.createFromInput(query.email)

		const resultPassword = Password.createFromInput(query.password)

		if ('failure' in resultEmail || 'failure' in resultPassword) {
			const notification = new Notification()
			notification.combineWithResult(resultPassword, resultEmail)
			throw new NotValidInputException(notification.errors)
		}

		const user = await this.userRepository.loadByEmail(resultEmail.ok)

		if (user.isNull()) {
			throw new NotValidInputException([UserResponseMessages.INVALID_CREDENTIALS])
		}

		if (user.status !== UserStatus.EMAIL_VERIFIED) {
			throw new InValidOperationException(UserResponseMessages.EMAIL_IS_NOT_VERIFIED)
		}

		const equals = await this.hashService.compare(user.password.value, query.password)

		if (!equals) {
			throw new NotValidInputException([UserResponseMessages.INVALID_CREDENTIALS])
		}

		const token = await this.tokenService.sign(
			JSON.stringify({ userId: user.id.value, name: user.name.value }),
			24 * 60
		)

		return token
	}
}
