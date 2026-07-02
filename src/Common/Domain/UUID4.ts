import * as crypto from 'crypto'
import Result from 'src/Common/Application/Result'
import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'

export default class UUID4 extends ValueObject<string> {
	private static UUID4_VALIDATOR = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

	public static createFromInput(uuid: string = ''): Result<UUID4, Notification> {
		const trimUUID = uuid.trim()

		if (!UUID4.UUID4_VALIDATOR.test(trimUUID)) {
			const notification = new Notification()
			notification.addError('INVALID_ID')
			return { failure: notification }
		}

		return { ok: new UUID4(trimUUID) }
	}

	public static createEmpty(): UUID4 {
		return new UUID4('')
	}
	public static create(): UUID4 {
		return new UUID4(crypto.randomUUID({ disableEntropyCache: true }))
	}
	public static fromValid(uuid4: string): UUID4 {
		return new UUID4(uuid4)
	}
	public static isValid(aUUIDV4: string): boolean {
		return new RegExp(UUID4.UUID4_VALIDATOR).test(aUUIDV4)
	}
}
