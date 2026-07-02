import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Publisher } from 'src/Common/Application/Output/Publisher'
import * as amqp from 'amqplib'

@Injectable()
export class RabbitMQPublisher implements Publisher {
	private channel: amqp.Channel
	constructor(private readonly amqpConnection: AmqpConnection) {}

	async publish(eventName: string, event: any): Promise<void> {
		this.amqpConnection.publish('Product', eventName, event)
	}
}
