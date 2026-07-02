import Result from 'src/Common/Application/Result'
import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'

export default class Email extends ValueObject<string> {
	private static regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

	public static INVALID_FORMAT = 'INVALID_EMAIL_FORMAT'
	public static MINIMUM_LENGTH = 6

	private static isValid(email: string): boolean {
		return Email.regex.test(email)
	}
	public static createFromInput(email: string): Result<Email, Notification> {
		const notification = new Notification()
		const trimEmail = String(email).trim()

		if (!Email.isValid(trimEmail)) {
			notification.addError(Email.INVALID_FORMAT)
			return { failure: notification }
		}
		return { ok: new Email(trimEmail) }
	}
	public static createFromValid(email: string): Email {
		return new Email(email)
	}
}
