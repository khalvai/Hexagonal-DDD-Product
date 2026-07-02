import { Inject } from '@nestjs/common'
import { HashService } from 'src/Common/Application/Output/HashService'
import Result from 'src/Common/Application/Result'
import { RegisterCommand } from 'src/User/Application/Commands/RegisterCommand'
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository'
import { Register } from 'src/User/Application/UseCases/Register'
import Email from 'src/User/Domain/Email'
import IP from 'src/User/Domain/IP'
import Name from 'src/User/Domain/Name'
import Password from 'src/User/Domain/Password'
import Notification from 'src/Common/Application/Notification'
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput'
import AlreadyExistsException from 'src/Common/Domain/Exceptions/AlreadyExistsException'
import UserId from 'src/User/Domain/UserId'
import User from 'src/User/Domain/User'
import { CommandHandler } from '@nestjs/cqrs'

@CommandHandler(RegisterCommand)
export class RegisterUseCaseImpl implements Register {
	public constructor(
		@Inject(HashService)
		private readonly hashService: HashService,

		@Inject(UserRepository)
		private readonly userRepository: UserRepository
	) {}
	async execute(command: RegisterCommand): Promise<Result<void>> {
		const emailResult = Email.createFromInput(command.email)
		const passwordResult = Password.createFromInput(command.password)
		const confirmPasswordResult = Password.createFromInput(command.confirmPassword)
		const nameResult = Name.createFromInput(command.name)
		const ipResult = IP.createFromInput(command.ip)

		if (
			'failure' in emailResult ||
			'failure' in passwordResult ||
			'failure' in confirmPasswordResult ||
			'failure' in nameResult ||
			'failure' in ipResult
		) {
			const notification = new Notification()
			notification.combineWithResult(emailResult, passwordResult, confirmPasswordResult, nameResult, ipResult)
			throw new NotValidInputException(notification.errors)
		}

		const isItNull = (await this.userRepository.loadByEmail(emailResult.ok)).isNull()

		if (!isItNull) {
			throw new AlreadyExistsException('USER_ALREADY_EXISTS')
		}

		const hashedPassword = await this.hashService.createHash(passwordResult.ok.value)

		const uuid = UserId.create()

		const user: User = new User()

		user.register(uuid, nameResult.ok, emailResult.ok, Password.createFromHashed(hashedPassword), ipResult.ok)

		await this.userRepository.save(user)

		return { ok: undefined }
	}
}
