import { Injectable } from '@nestjs/common'
import Email from 'src/User/Domain/Email'
import Name from 'src/User/Domain/Name'
import Password from 'src/User/Domain/Password'
import User from 'src/User/Domain/User'
import UserId from 'src/User/Domain/UserId'
import UserPersistenceModel from 'src/User/Infrastructure/Output/Model/UserPersistenceModel'

@Injectable()
export default class UserMapper {
	toDomain(model: UserPersistenceModel): User {
		const user: User = new User()

		user.userId = UserId.fromValid(model.id)
		user.email = Email.createFromValid(model.email)
		user.name = Name.createFromValid(model.name)
		user.password = Password.createFromHashed(model.password)
		user.status = model.status
		user.createdAt = model.createdAt
		user.updatedAt = model.updatedAt
		user.concurrencySafeVersion = model.concurrencySafeVersion

		return user
	}

	toPersistence(user: User): UserPersistenceModel {
		const model: UserPersistenceModel = {
			id: user.userId.value,
			email: user.email.value,
			name: user.name.value,
			password: user.password.value,
			status: user.status,
			concurrencySafeVersion: user.concurrencySafeVersion,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		}
		return model
	}
}
