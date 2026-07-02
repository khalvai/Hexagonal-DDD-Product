import Code from 'src/Product/Domain/Code'
import { Product } from 'src/Product/Domain/Product'
import { ProductReadModel } from 'src/Product/Infrastructure/Models/ProductReadModel'
import UserId from 'src/User/Domain/UserId'

export const ProductRepository = Symbol('ProductRepository').valueOf()
export interface ProductRepository {
	productExistsIn(codes: Code[]): Promise<boolean>
	save(product: Product): Promise<void>
	saveAll(products: Product[]): Promise<void>
	getAll(userId: UserId): Promise<Product[]>
	getAllReadModels(userId: UserId): Promise<ProductReadModel[]>
}
