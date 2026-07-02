import DomainEvent from 'src/Common/Domain/DomainEvent'
import UUID4 from 'src/Common/Domain/UUID4'

export default abstract class Entity<Id> {
	public id: Id
	private events: Set<DomainEvent<any>> = new Set()

	protected addEvent(event: DomainEvent<any>): void {
		this.events.add(event)
	}
	public clearEvent(): void {
		this.events.clear()
	}
	public getEvents(): Set<DomainEvent<any>> {
		return this.events
	}

	public equals(entity: Entity<Id>): boolean {
		if (this === entity) {
			return true
		}
		if (entity instanceof Entity && this.id === entity.id) {
			return true
		}
		return false
	}
}
