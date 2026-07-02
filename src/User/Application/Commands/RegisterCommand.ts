export class RegisterCommand {
	constructor(
		public readonly email: string,
		public readonly password: string,
		public readonly confirmPassword: string,
		public readonly name: string,
		public readonly ip: string
	) {}
}
