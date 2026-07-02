import { OutboxModel } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper'

export const OutboxRepository = Symbol('OutboxRepository').valueOf()
export interface OutboxRepository {
	getUnDispatched(): Promise<OutboxModel[]>
	save(outboxes: OutboxModel[], connection: any): Promise<void>
	dispatched(eventId: string): Promise<void>
}
