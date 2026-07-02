import Result from './Result'

export default class Notification {
	public errors: string[] = []

	public addError(message: string): void {
		this.errors.push(message)
	}
	public hasErrors(): boolean {
		return this.errors.length > 0
	}

	public combine(notification: Notification): void {
		this.errors.push(...notification.errors)
	}

	public combineWithResult(...results: Result<any, Notification>[]): void {
		for (const res of results) {
			if ('failure' in res) {
				this.combine(res.failure)
			}
		}
	}
}
