import AggregateRoot from 'src/Common/Domain/AggregateRoot'
import Code from 'src/Product/Domain/Code'
import { NewProductCreated } from 'src/Product/Domain/Events/NewProductCreated'
import { ProductDeleted } from 'src/Product/Domain/Events/ProductDeleted'
import Id from 'src/Product/Domain/Id'
import { UserId } from 'src/Product/Domain/UserId'
import { Value } from 'src/Product/Domain/Value'
import Name from 'src/User/Domain/Name'

export class Product extends AggregateRoot<Id> {
	public code: Code
	public name: Name
	public value: Value
	public userId: UserId

	static create(code: Code, name: Name, value: Value, userId: UserId): Product {
		const id: Id = Id.create()

		// business logic goes here for creating product
		const product = new Product()
		product.id = id
		product.name = name
		product.value = value
		product.code = code
		product.userId = userId

		product.addEvent(NewProductCreated.of(product))
		return product
	}

	delete(): void {
		this.addEvent(ProductDeleted.of(this))
	}
	public validatePreconditions(...args: string[]): void {
		throw new Error('Method not implemented.')
	}
	public validateInvariant(): void {
		throw new Error('Method not implemented.')
	}
}
