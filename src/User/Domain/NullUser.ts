import User from './User'

class NullUser extends User {
	public isNull(): boolean {
		return true
	}
}

export default new NullUser()
