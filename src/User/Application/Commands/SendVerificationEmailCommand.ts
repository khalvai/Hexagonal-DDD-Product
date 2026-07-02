export class SendVerificationEmailCommand {
	constructor(
		public readonly email: string,
		public readonly name: string,
		public readonly userId: string,
		public readonly ip: string
	) {}
}
