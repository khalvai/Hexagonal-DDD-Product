export const HashService = Symbol('HashService').valueOf()
export interface HashService {
	createHash(data: string): Promise<string>
	compare(hash: string, data: string): Promise<boolean>
}
