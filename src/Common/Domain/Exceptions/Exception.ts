export default abstract class Exception extends Error {
	constructor(public readonly message: string) {
		super(message)
	}
}
