import Result from 'src/Common/Application/Result'
import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'

export default class Code extends ValueObject<string> {
	static createFromInput(code: string): Result<Code, Notification> {
		return { ok: new Code(code) }
	}

	static createFromValid(code: string): Code {
		return new Code(code)
	}
}
