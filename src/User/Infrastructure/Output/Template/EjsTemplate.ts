import { Template } from 'src/User/Application/Ports/Output/Template'

export class EJSTemplate implements Template {
	getWelcomeTemplate(userFirstName: string, userLastName: string): string {
		return `some ejs template that uses ${userFirstName} ${userLastName}`
	}
	getVerifyEMailTemplate(token: string, email: string, ip: string): string {
		return `some ejs file that uses ${token}, ${email} and ${ip}`
	}
	getChangingEmailTemplate(token: string, mail: string, ip: string): string {
		throw new Error('Method not implemented.')
	}
	getForgotPasswordTemplate(token: string, mail: string, ip: string): string {
		throw new Error('Method not implemented.')
	}
	getYouHaveChangeEmailTemplate(latterMail: string, ip: string, changedDate: Date): string {
		throw new Error('Method not implemented.')
	}
}
