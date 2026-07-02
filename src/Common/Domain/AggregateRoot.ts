import ConcurrencySafeEntity from 'src/Common/Domain/ConcurrencySafeEntity'

export default abstract class AggregateRoot<Id> extends ConcurrencySafeEntity<Id> {
	public abstract validatePreconditions(...args: string[]): void
	public abstract validateInvariant(): void
}
