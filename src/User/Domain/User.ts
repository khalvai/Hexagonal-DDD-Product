import { UserStatus } from '@prisma/client'
import AggregateRoot from 'src/Common/Domain/AggregateRoot'
import Email from 'src/User/Domain/Email'
import NewUserRegistered from 'src/User/Domain/Events/NewUserRegistered'
import { UserConfirmed } from 'src/User/Domain/Events/UserConfirmed'
import IP from 'src/User/Domain/IP'
import Name from 'src/User/Domain/Name'
import Password from 'src/User/Domain/Password'
import UserId from 'src/User/Domain/UserId'

export default class User extends AggregateRoot<UserId> {
	public email: Email
	public password: Password
	public name: Name
	public status: string = UserStatus.PENDING_EMAIL_VERIFICATION
	public createdAt: Date
	public updatedAt: Date

	public get userId(): UserId {
		return this.id
	}

	public set userId(userId: UserId) {
		this.id = userId
	}

	public register(userId: UserId, name: Name, email: Email, password: Password, ip: IP): void {
		const now = new Date()
		now.setMilliseconds(0)

		this.updatedAt = now
		this.id = userId
		this.name = name

		this.email = email

		this.password = password

		this.status = UserStatus.PENDING_EMAIL_VERIFICATION
		this.createdAt = now
		this.updatedAt = now

		this.addEvent(NewUserRegistered.of(this, ip))
	}

	public confirmEmail(): void {
		this.status = UserStatus.EMAIL_VERIFIED

		this.addEvent(UserConfirmed.of(this))
	}

	public validatePreconditions(...args: string[]): void {
		throw new Error('Method not implemented.')
	}
	public validateInvariant(): void {
		throw new Error('Method not implemented.')
	}

	public isNull(): boolean {
		return false
	}
}
