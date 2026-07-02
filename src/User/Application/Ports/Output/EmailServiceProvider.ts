import Result from 'src/Common/Application/Result'
import Email from 'src/User/Domain/Email'

export const EmailServiceProvider = Symbol('EmailServiceProvider').valueOf()
export interface EmailServiceProvider {
	send(template: string, to: Email): Promise<Result<void>>
}
