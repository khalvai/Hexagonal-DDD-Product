import { UserResponseMessages } from 'ResponseMessages/user.response.messages'
import Exception from 'src/Common/Domain/Exceptions/Exception'

export class UnauthorizedException extends Exception {
	constructor() {
		super(UserResponseMessages.USER_NOT_AUTHENTICATED)
	}
}
