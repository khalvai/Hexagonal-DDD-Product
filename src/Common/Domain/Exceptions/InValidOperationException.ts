import Exception from './Exception'

export class InValidOperationException extends Exception {
	constructor(errorMessage: string) {
		super(errorMessage)
	}
}
