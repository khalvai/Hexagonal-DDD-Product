import { Inject } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { TokenService } from 'src/Common/Application/Output/TokenService'
import Result from 'src/Common/Application/Result'
import { SendVerificationEmailCommand } from 'src/User/Application/Commands/SendVerificationEmailCommand'
import { EmailServiceProvider } from 'src/User/Application/Ports/Output/EmailServiceProvider'
import { Template } from 'src/User/Application/Ports/Output/Template'
import { SendVerificationEmail } from 'src/User/Application/UseCases/SendVerificationEmail'
import Email from 'src/User/Domain/Email'

@CommandHandler(SendVerificationEmailCommand)
export class SendVerificationEmailImp implements SendVerificationEmail {
	constructor(
		@Inject(TokenService) private readonly tokenService: TokenService,
		@Inject(Template) private readonly template: Template,
		@Inject(EmailServiceProvider) private readonly emailServicerProvider: EmailServiceProvider
	) {}
	async execute(command: SendVerificationEmailCommand): Promise<Result<void>> {
		const token = await this.tokenService.sign(JSON.stringify(command), 4)

		const template = this.template.getVerifyEMailTemplate(token, command.email, command.ip)

		const email = Email.createFromValid(command.email)

		await this.emailServicerProvider.send(template, email)

		console.log(token)

		return { ok: undefined }
	}
}
