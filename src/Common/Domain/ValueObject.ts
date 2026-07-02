import { shallowEqual } from 'shallow-equal-object'

export default class ValueObject<T> {
	protected constructor(public value: T) {
		this.value = Object.freeze(value)
	}

	public equals(valueObject: ValueObject<T>): boolean {
		return shallowEqual(this.value, valueObject.value)
	}
}
