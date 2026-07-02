import DomainEvent from 'src/Common/Domain/DomainEvent'
import { Product } from 'src/Product/Domain/Product'
type Payload = {
	name: string
	value: number
	id: string
	code: string
}
export class NewProductCreated extends DomainEvent<Payload> {
	public isPublic: boolean = false

	static of(product: Product): NewProductCreated {
		return new NewProductCreated({
			code: product.code.value,
			id: product.id.value,
			name: product.name.value,
			value: product.value.value
		})
	}
}
