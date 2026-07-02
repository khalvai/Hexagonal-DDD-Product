import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'
import Result from 'src/Common/Application/Result'

export default class Name extends ValueObject<string> {
	public static NAME_CAN_NOT_BE_AN_EMPTY_STRING = 'NAME_CAN_NOT_BE_AN_EMPTY_STRING'
	public static INVALID_NAME_LENGTH = 'INVALID_NAME_LENGTH'

	public static createFromInput(name: string): Result<Name, Notification> {
		const notification = new Notification()
		const trimName = String(name).trim()

		if (name.length === 0) {
			notification.addError(Name.NAME_CAN_NOT_BE_AN_EMPTY_STRING)
		}
		if (name.length < 4 || name.length > 20) {
			notification.addError(Name.INVALID_NAME_LENGTH)
		}
		if (notification.hasErrors()) {
			return { failure: notification }
		}
		return {
			ok: new Name(trimName)
		}
	}
	public static createFromValid(name: string): Name {
		return new Name(name)
	}
}
