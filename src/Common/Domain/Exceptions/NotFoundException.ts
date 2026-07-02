import Exception from './Exception'

export class NotFoundException extends Exception {
	constructor(errorMessage: string) {
		super(errorMessage)
	}
}
