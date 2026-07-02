import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Publisher } from 'src/Common/Application/Output/Publisher'
import { NestjsEventPublisher } from 'src/Common/Infrastructure/Output/NestjsEventEmitter'

@Module({
	imports: [EventEmitterModule.forRoot()],
	providers: [
		{
			provide: Publisher,
			useClass: NestjsEventPublisher
		}
	],
	exports: [
		{
			provide: Publisher,
			useClass: NestjsEventPublisher
		}
	]
})
export class NestjsEventEmitterModule {}
