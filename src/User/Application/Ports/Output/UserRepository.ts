import Email from 'src/User/Domain/Email'
import User from 'src/User/Domain/User'
import UserId from 'src/User/Domain/UserId'

export const UserRepository = Symbol('UserRepository').valueOf()
export interface UserRepository {
	load(userId: UserId): Promise<User>
	loadByEmail(email: Email): Promise<User>
	save(user: User): Promise<void>
}
