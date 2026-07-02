import Result from 'src/Common/Application/Result'
import UUID4 from 'src/Common/Domain/UUID4'
import Notification from 'src/Common/Application/Notification'

export default class Id extends UUID4 {
	public static createFromInput(uuid: string): Result<Id, Notification> {
		const trimUUID = String(uuid).trim()

		if (!Id.isValid(trimUUID)) {
			const notification = new Notification()

			notification.addError('INVALID_ID')

			return {
				failure: notification
			}
		}
		return { ok: new Id(trimUUID) }
	}

	public static fromValid(uuid4: string): UUID4 {
		return new Id(uuid4)
	}
}
