import DomainEvent from 'src/Common/Domain/DomainEvent'
import User from 'src/User/Domain/User'
type EventPayload = {
	name: string
	email: string
	userId: string
}
export class UserConfirmed extends DomainEvent<EventPayload> {
	public isPublic: boolean = false

	static of(user: User): UserConfirmed {
		return new UserConfirmed({ email: user.email.value, name: user.name.value, userId: user.id.value })
	}
}
