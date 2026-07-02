export default class UserPersistenceModel {
	id: string
	email: string
	name: string
	password: string
	status: string
	concurrencySafeVersion: number
	createdAt: Date
	updatedAt: Date
}
