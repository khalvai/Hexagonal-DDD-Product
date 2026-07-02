import Result from 'src/Common/Application/Result'
import { EmailServiceProvider } from 'src/User/Application/Ports/Output/EmailServiceProvider'
import Email from 'src/User/Domain/Email'

export class LiaraEmailServiceProvider implements EmailServiceProvider {
	async send(template: string, to: Email): Promise<Result<void>> {
		// talk to a 3rd party to send email

		return { ok: undefined }
	}
}
