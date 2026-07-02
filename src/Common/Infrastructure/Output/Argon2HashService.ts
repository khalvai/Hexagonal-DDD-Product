import * as argon2 from 'argon2'
import { HashService } from 'src/Common/Application/Output/HashService'

export class Argon2HashService implements HashService {
	public async createHash(data: string): Promise<string> {
		return await argon2.hash(data)
	}

	public async compare(hash: string, data: string): Promise<boolean> {
		return await argon2.verify(hash, data)
	}
}
