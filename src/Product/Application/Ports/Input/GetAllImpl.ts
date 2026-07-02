import { Inject, Injectable } from '@nestjs/common'
import { QueryHandler } from '@nestjs/cqrs'
import { ProductRepository } from 'src/Product/Application/Ports/Output/ProductRepository'
import { GetAllQuery } from 'src/Product/Application/Queries/GetAllQuery'
import { GetAll } from 'src/Product/Application/UseCases/GetAll'
import { Product } from 'src/Product/Domain/Product'
import { UserId } from 'src/Product/Domain/UserId'
import { ProductReadModel } from 'src/Product/Infrastructure/Models/ProductReadModel'

@QueryHandler(GetAllQuery)
export class GetAllImp implements GetAll {
	constructor(@Inject(ProductRepository) private readonly productRepository: ProductRepository) {}

	async execute(query: GetAllQuery): Promise<ProductReadModel[]> {
		const userId = UserId.createFromValid(query.userId)
		const productsReadModel = await this.productRepository.getAllReadModels(userId)

		return productsReadModel
	}
}
