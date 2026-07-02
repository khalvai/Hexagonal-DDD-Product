/* eslint-disable accessor-pairs */

import UUID4 from './UUID4'

export default class DomainEvent<Payload> {
	public readonly occurredOn: Date = new Date()
	public readonly id: UUID4 = UUID4.create()
	public readonly name: string = this.constructor.name
	public readonly isPublic: boolean = false
	public constructor(private readonly _payload: Payload) {}

	public get payload(): string {
		return JSON.stringify(this._payload)
	}
}
