import { Injectable } from '@nestjs/common'
import PrismaService from 'src/Common/Infrastructure/Output/PrismaService'
import { ProductRepository } from 'src/Product/Application/Ports/Output/ProductRepository'
import Code from 'src/Product/Domain/Code'
import { NewProductCreated } from 'src/Product/Domain/Events/NewProductCreated'
import { ProductDeleted } from 'src/Product/Domain/Events/ProductDeleted'
import { Product } from 'src/Product/Domain/Product'
import { ProductReadModel } from 'src/Product/Infrastructure/Models/ProductReadModel'
import { ProductMapper } from 'src/Product/Infrastructure/ProductMapper'
import UserId from 'src/User/Domain/UserId'

@Injectable()
export class PostgresqlProductRepository implements ProductRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mapper: ProductMapper
	) {}

	async productExistsIn(codes: Code[]): Promise<boolean> {
		const stringCodes = codes.map(c => c.value)

		const exists = await this.prisma.product.findMany({
			where: {
				code: {
					in: stringCodes
				}
			}
		})
		return exists.length > 0 ? true : false
	}
	async save(product: Product): Promise<void> {
		const productModel = this.mapper.toPersistent(product)
		await this.prisma.product.create({
			data: productModel
		})
		return
	}
	async saveAll(products: Product[]): Promise<void> {
		const create: Product[] = []
		const deleteP: Product[] = []

		for (const product of products) {
			const events = product.getEvents()
			for (const event of events) {
				if (event.name === NewProductCreated.name) {
					create.push(product)
				}

				if (event.name === ProductDeleted.name) {
					deleteP.push(product)
				}
			}
		}

		if (create.length > 0) {
			await this.create(products)
		}

		if (deleteP.length > 0) {
			await this.delete(deleteP)
		}

		return
	}

	async getAllReadModels(userId: UserId): Promise<ProductReadModel[]> {
		const productModels = await this.prisma.product.findMany({
			where: {
				userId: userId.value
			}
		})

		const readModels = productModels.map(p => this.mapper.toRead(p))
		return readModels
	}

	async getAll(userId: UserId): Promise<Product[]> {
		const productModels = await this.prisma.product.findMany({
			where: {
				userId: userId.value
			}
		})
		const products = productModels.map(p => this.mapper.toDomain(p))
		return products
	}

	private async create(products: Product[]) {
		const productsModel = products.map(p => this.mapper.toPersistent(p))
		await this.prisma.product.createMany({
			data: productsModel
		})
	}

	private async delete(products: Product[]) {
		const productsCodes = products.map(p => p.code.value)
		await this.prisma.product.deleteMany({
			where: {
				code: {
					in: productsCodes
				}
			}
		})
	}
}
