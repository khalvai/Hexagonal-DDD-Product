import { Inject, Injectable } from '@nestjs/common'
import { Prisma, UserStatus } from '@prisma/client'
import { OutboxRepository } from 'src/User/Application/Ports/Output/OutboxRepository'
import { UserRepository } from 'src/User/Application/Ports/Output/UserRepository'
import Email from 'src/User/Domain/Email'
import NewUserRegistered from 'src/User/Domain/Events/NewUserRegistered'
import { UserConfirmed } from 'src/User/Domain/Events/UserConfirmed'
import NullUser from 'src/User/Domain/NullUser'
import User from 'src/User/Domain/User'
import UserId from 'src/User/Domain/UserId'
import { OutboxMapper, OutboxModel } from 'src/User/Infrastructure/Output/Mapper/OutboxMapper'
import UserMapper from 'src/User/Infrastructure/Output/Mapper/UserMapper'
import UserPersistenceModel from 'src/User/Infrastructure/Output/Model/UserPersistenceModel'
import PrismaService from 'src/Common/Infrastructure/Output/PrismaService'

@Injectable()
export class PostgresqlUserRepository implements UserRepository {
	constructor(
		@Inject(OutboxRepository)
		private readonly outboxRepository: OutboxRepository,
		private readonly prisma: PrismaService,
		private readonly userMapper: UserMapper,
		private readonly outboxMapper: OutboxMapper
	) {}

	async load(userId: UserId): Promise<User> {
		const userModel = await this.prisma.user.findUnique({
			where: {
				id: userId.value
			}
		})

		if (userModel) {
			const user: User = this.userMapper.toDomain(userModel)

			return user
		} else {
			return NullUser
		}
	}

	async loadByEmail(email: Email): Promise<User> {
		const userModel = await this.prisma.user.findUnique({
			where: {
				email: email.value
			}
		})

		if (userModel) {
			const user = this.userMapper.toDomain(userModel)
			return user
		}
		return NullUser
	}
	async save(user: User): Promise<void> {
		let userModel = this.userMapper.toPersistence(user)

		const events = user.getEvents()

		for (const event of events) {
			if (event.name === NewUserRegistered.name) {
				await this.prisma.$transaction(async tx => {
					await this.create(userModel, tx)
					await this.outboxRepository.save([this.outboxMapper.toPersistence(event)], tx)
				})
			}

			if (event.name === UserConfirmed.name) {
				await this.confirmEmail(user)
			}
		}

		return
	}

	private async create(userModel: UserPersistenceModel, tx: Prisma.TransactionClient) {
		await tx.user.create({
			data: {
				id: userModel.id,
				name: userModel.name,
				email: userModel.email,
				password: userModel.password,
				status: userModel.status as UserStatus,
				updatedAt: userModel.updatedAt,
				createdAt: userModel.createdAt,
				concurrencySafeVersion: userModel.concurrencySafeVersion
			}
		})
	}

	private async confirmEmail(user: User) {
		await this.prisma.user.update({
			where: {
				id: user.id.value
			},
			data: {
				status: 'EMAIL_VERIFIED'
			}
		})
	}
}
