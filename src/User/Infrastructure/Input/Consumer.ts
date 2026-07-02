import { Controller } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ApiTags } from '@nestjs/swagger'
import { SendVerificationEmailImp } from 'src/User/Application/Ports/Input/SendVerificationEmailImpl'
import NewUserRegistered from 'src/User/Domain/Events/NewUserRegistered'

@ApiTags('Consumer')
@Controller()
export class Consumer {
	public constructor(private readonly sendVerificationEmailInput: SendVerificationEmailImp) {}

	@OnEvent('NewUserRegistered')
	async onUserRegistered(event: NewUserRegistered) {
		const { email, name, ip, userId } = JSON.parse(event.payload)

		const result = this.sendVerificationEmailInput.execute({ email, ip, name, userId })
		if ('failure' in result) {
			throw result.failure
		}
	}
}
