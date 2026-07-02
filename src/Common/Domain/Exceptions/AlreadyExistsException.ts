import Exception from './Exception'

export default class AlreadyExistsException extends Exception {
	constructor(errorMessage: string) {
		super(errorMessage)
	}
}
