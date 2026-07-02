import DomainEvent from 'src/Common/Domain/DomainEvent'
import User from '../User'
import IP from 'src/User/Domain/IP'

interface EventPayload {
	userId: string
	email: string
	name: string
	ip: string
}
export default class NewUserRegistered extends DomainEvent<EventPayload> {
	public isPublic: boolean = true

	private constructor(userId: string, email: string, name: string, ip: string) {
		super({ email, name, userId, ip })
	}

	static of(user: User, ip: IP): NewUserRegistered {
		return new NewUserRegistered(user.userId.value, user.email.value, user.name.value, ip.value)
	}
}
