import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository'
import { OutboxModel } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper'

@Injectable()
export default class PostgresqlOutboxRepository implements OutboxRepository {
	constructor(private readonly prisma: PrismaService) {}

	async dispatched(eventId: string): Promise<void> {
		await this.prisma.outbox.update({
			where: {
				id: eventId
			},
			data: {
				dispatched: true
			}
		})

		return
	}
	async save(outboxes: OutboxModel[], connection: Prisma.TransactionClient): Promise<void> {
		await connection.outbox.createMany({
			data: outboxes
		})

		return
	}

	async getUnDispatched(): Promise<OutboxModel[]> {
		const outboxes: OutboxModel[] = await this.prisma.outbox.findMany({
			where: {
				dispatched: false
			}
		})

		return outboxes
	}
}
