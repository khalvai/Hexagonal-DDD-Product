export const Template = Symbol('Template').valueOf()
export interface Template {
	getWelcomeTemplate(userFirstName: string, userLastName: string): string
	getVerifyEMailTemplate(token: string, email: string, ip: string): string
	getChangingEmailTemplate(token: string, email: string, ip: string): string
	getForgotPasswordTemplate(token: string, email: string, ip: string): string
	getYouHaveChangeEmailTemplate(latterMail: string, ip: string, changedDate: Date): string
}
