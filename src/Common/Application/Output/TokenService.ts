import Result from 'src/Common/Application/Result'

export const TokenService = Symbol('TokenService').valueOf()

export interface TokenService {
	sign(data: string, expiresAtInMinutes: number): Promise<string>
	verify(token: string): Promise<Result<string>>
}
