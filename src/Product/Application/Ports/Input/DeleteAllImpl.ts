import { DeleteAllCommand } from 'src/Product/Application/Commands/DeleteAllCommand'
import { DeleteAll } from 'src/Product/Application/UseCases/DeleteAll'
import { Inject } from '@nestjs/common'
import { ProductRepository } from 'src/Product/Application/Ports/Output/ProductRepository'
import UserId from 'src/User/Domain/UserId'
import { CommandHandler } from '@nestjs/cqrs'

@CommandHandler(DeleteAllCommand)
export class DeleteAllImpl implements DeleteAll {
	constructor(@Inject(ProductRepository) private readonly productRepository: ProductRepository) {}

	async execute(command: DeleteAllCommand): Promise<Promise<void>> {
		const userId = UserId.fromValid(command.userId)
		const products = await this.productRepository.getAll(userId)

		for (const product of products) {
			product.delete()
		}

		await this.productRepository.saveAll(products)

		return
	}
}
