import { Inject, Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Publisher } from 'src/Common/Application/Output/Publisher'
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository'

// Suggestion: this code has n+1 problem we can optimize it
@Injectable()
export class OutboxDispatcher {
	constructor(
		@Inject(OutboxRepository)
		private readonly outboxRepository: OutboxRepository,
		@Inject(Publisher) private readonly publisher: Publisher
	) {}

	@Cron('*/20 * * * * *')
	async dispatchEvents() {
		console.log(`cron is running: ${Date.now()}`)

		try {
			const outboxes = await this.outboxRepository.getUnDispatched()

			for (const outbox of outboxes) {
				await this.publisher.publish(outbox.name, outbox)
				await this.outboxRepository.dispatched(outbox.id)
			}
		} catch (error) {
			console.error('Failed to dispatch event', error)
		}
	}
}

// at least one time delivery
