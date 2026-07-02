import { Inject } from '@nestjs/common'
import Result from 'src/Common/Application/Result'
import CreateManyCommand from 'src/Product/Application/Commands/CreateManyCommand'
import { ProductRepository } from 'src/Product/Application/Ports/Output/ProductRepository'
import CreateMany from 'src/Product/Application/UseCases/CreateMany'
import Code from 'src/Product/Domain/Code'
import Notification from 'src/Common/Application/Notification'
import { Value } from 'src/Product/Domain/Value'
import { Name } from 'src/Product/Domain/Name'
import { Product } from 'src/Product/Domain/Product'
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput'
import { ProductResponseMessages } from 'ResponseMessages/product.response.messages'
import { CommandHandler } from '@nestjs/cqrs'
import { UserId } from 'src/Product/Domain/UserId'

@CommandHandler(CreateManyCommand)
export class CreateManyImpl implements CreateMany {
	constructor(@Inject(ProductRepository) private readonly productRepository: ProductRepository) {}

	async execute(command: CreateManyCommand): Promise<void> {
		// this will check whatever the all codes in the input is unique  or not
		if (command.createCommands.length !== [...new Set(command.createCommands.map(c => c.code))].length) {
			throw new NotValidInputException([ProductResponseMessages.PRODUCT_CODE_IS_NOT_UNIQUE])
		}

		const products: Product[] = []
		const userId = UserId.createFromValid(command.userId)

		for (const data of command.createCommands) {
			const nameResult = Name.createFromInput(data.name)
			const valueResult = Value.createFromInput(data.value)
			const codeResult = Code.createFromInput(data.code)

			if ('failure' in nameResult || 'failure' in valueResult || 'failure' in codeResult) {
				const notification = new Notification()
				notification.combineWithResult(nameResult, valueResult, codeResult)
				throw new NotValidInputException(notification.errors)
			}

			const product = Product.create(codeResult.ok, nameResult.ok, valueResult.ok, userId)
			products.push(product)
		}

		const productExists = await this.productRepository.productExistsIn(products.map(p => p.code))

		if (productExists) {
			throw new NotValidInputException([ProductResponseMessages.PRODUCT_WITH_THE_CODE_EXISTS])
		}

		await this.productRepository.saveAll(products)
	}
}
