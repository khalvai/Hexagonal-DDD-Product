import DomainEvent from 'src/Common/Domain/DomainEvent'
import { Product } from 'src/Product/Domain/Product'

type Payload = {
	userId: string
	productId: string
}
export class ProductDeleted extends DomainEvent<Payload> {
	static of(product: Product): ProductDeleted {
		return new ProductDeleted({ productId: product.id.value, userId: product.userId.value })
	}
}
