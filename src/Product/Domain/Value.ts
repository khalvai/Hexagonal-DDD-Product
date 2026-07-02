import Result from 'src/Common/Application/Result'
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput'
import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'
import { ProductResponseMessages } from 'ResponseMessages/product.response.messages'

export class Value extends ValueObject<number> {
	static createFromInput(value: number): Result<Value, Notification> {
		if (value < 0) {
			const notification = new Notification()
			notification.addError(ProductResponseMessages.VALUE_CAN_NOT_BE_NEGATIVE)
			return { failure: notification }
		}
		return { ok: new Value(value) }
	}

	static createFromValid(value: number): Value {
		return new Value(value)
	}
}
