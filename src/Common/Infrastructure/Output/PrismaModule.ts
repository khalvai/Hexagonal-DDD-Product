import { Logger, Module } from '@nestjs/common'
import { PrismaModule as _PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma'
import PrismaService from 'src/Common/Infrastructure/Output/PrismaService'

@Module({
	imports: [
		_PrismaModule.forRoot({
			isGlobal: true,
			prismaServiceOptions: {
				middlewares: [
					loggingMiddleware({
						logger: new Logger('PrismaMiddleware'),
						logLevel: 'log', // default is `debug`
						logMessage: (query: QueryInfo) =>
							`[Prisma Query]')} ${query.model}.${query.action} - ${query.executionTime}ms`
					})
				],
				prismaOptions: {
					log: ['error', 'info'],
					errorFormat: 'pretty'
				},
				explicitConnect: true
			}
		})
	],
	providers: [PrismaService],
	exports: [PrismaService]
})
export default class PrismaModule {}
