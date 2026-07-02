import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export default class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect()
	}
}
