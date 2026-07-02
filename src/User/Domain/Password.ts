import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'
import Result from 'src/Common/Application/Result'

export default class Password extends ValueObject<string> {
	public static PASSWORD_COULD_NOT_BE_AN_EMPTY_STRING = 'PASSWORD_COULD_NOT_BE_EMPTY'
	public static INVALID_LENGTH = 'PASSWORD_MUST_BETWEEN_8_AND_20_CHARACTERS'
	public static PASSWORD_NOT_MATCH = 'PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH'

	public static createFromInput(password: string): Result<Password, Notification> {
		const trimPassword = String(password).trim()
		const notification = new Notification()

		if (password.length === 0) {
			notification.addError(Password.PASSWORD_COULD_NOT_BE_AN_EMPTY_STRING)
		}
		if (password.length < 8 || password.length > 20) {
			notification.addError(Password.INVALID_LENGTH)
		}

		if (notification.hasErrors()) {
			return { failure: notification }
		}

		return {
			ok: new Password(trimPassword)
		}
	}
	public static createFromValid(password: string): Password {
		return new Password(password)
	}
	public static createFromHashed(aHashedPassword: string): Password {
		return new Password(aHashedPassword)
	}

	public compareWithConfirm(password: Password): Result<Password, Notification> {
		if (!password.equals(this)) {
			const notification = new Notification()
			notification.addError(Password.PASSWORD_NOT_MATCH)
			return { failure: notification }
		}
		return { ok: new Password(password.value) }
	}
}
