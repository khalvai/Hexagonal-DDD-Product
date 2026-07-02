import { Module } from '@nestjs/common'
import { HashService } from 'src/Common/Application/Output/HashService'
import { TokenService } from 'src/Common/Application/Output/TokenService'
import { Argon2HashService } from 'src/Common/Infrastructure/Output/Argon2HashService'
import JWTokenService from 'src/Common/Infrastructure/Output/JWTokenService'
import { NestjsEventEmitterModule } from 'src/Common/Infrastructure/Output/NestjsEventEmitterModule'
import { ConfirmVerificationEmailImpl } from 'src/User/Application/Ports/Input/ConfirmVerificanEmailImpl'
import { RegisterUseCaseImpl } from 'src/User/Application/Ports/Input/RegisterImpl'
import { SendVerificationEmailImp } from 'src/User/Application/Ports/Input/SendVerificationEmailImpl'
import { EmailServiceProvider } from 'src/User/Application/Ports/Output/EmailServiceProvider'
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository'
import { Template } from 'src/User/Application/Ports/Output/Template'
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository'
import { Consumer } from 'src/User/Infrastructure/Input/Consumer'
import { LiaraEmailServiceProvider } from 'src/User/Infrastructure/Output/LiaraEmailServiceProvider'
import { OutboxMapper } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper'
import UserMapper from 'src/User/Infrastructure/Output/Mapper/UserMapper'
import { OutboxDispatcher } from 'src/User/Infrastructure/Output/OutboxDispatcher'
import PostgresqlOutboxRepository from 'src/User/Infrastructure/Output/Persistence/PostgresqlOutboxRepository'
import { PostgresqlUserRepository } from 'src/User/Infrastructure/Output/Persistence/PostgresqlUserRepository'
import { EJSTemplate } from 'src/User/Infrastructure/Output/Template/EjsTemplate'
import { CqrsModule } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import PrismaModule from 'src/Common/Infrastructure/Output/PrismaModule'
import { Publisher } from 'src/Common/Application/Output/Publisher'
import { NestjsEventPublisher } from 'src/Common/Infrastructure/Output/NestjsEventEmitter'
import LoginImpl from 'src/User/Application/Ports/Input/LoginImpl'
import UserController from 'src/User/Infrastructure/Input/HTTP/UserController'

@Module({
	imports: [PrismaModule, NestjsEventEmitterModule, CqrsModule, ConfigModule],
	controllers: [UserController, Consumer],
	providers: [
		{
			provide: UserRepository,
			useClass: PostgresqlUserRepository
		},

		{
			provide: OutboxRepository,
			useClass: PostgresqlOutboxRepository
		},
		{
			provide: TokenService,
			useClass: JWTokenService
		},

		{
			provide: HashService,
			useClass: Argon2HashService
		},
		{
			provide: Template,
			useClass: EJSTemplate
		},
		{
			provide: EmailServiceProvider,
			useClass: LiaraEmailServiceProvider
		},
		RegisterUseCaseImpl,
		SendVerificationEmailImp,
		ConfirmVerificationEmailImpl,
		LoginImpl,
		OutboxMapper,
		UserMapper,
		OutboxDispatcher
	]
})
export class UserModule {}
