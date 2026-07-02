import ValueObject from 'src/Common/Domain/ValueObject'

export class UserId extends ValueObject<string> {
	static createFromValid(userId: string): UserId {
		return new UserId(userId)
	}
}
