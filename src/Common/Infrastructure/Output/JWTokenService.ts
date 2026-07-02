import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { TokenService } from 'src/Common/Application/Output/TokenService'
import Result from 'src/Common/Application/Result'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
@Injectable()
export default class JWTokenService implements TokenService {
	public constructor(private readonly configService: ConfigService) {}

	public async sign(data: string, expiresAtInMinutes: number): Promise<string> {
		const timeInMilliSeconds = expiresAtInMinutes * 60 * 1000

		return jwt.sign(JSON.parse(data), this.configService.get('SECRET_KEY') || '', {
			expiresIn: timeInMilliSeconds.toString()
		})
	}
	public async verify(token: string): Promise<Result<string>> {
		try {
			const data = jwt.verify(token, this.configService.get('SECRET_KEY') || '') as object

			if ('exp' in data) {
				const exp = (data?.exp as number) * 1000

				if (exp < Date.now()) {
					return {
						failure: new UnauthorizedException('TOKEN_EXPIRED')
					}
				}
				return { ok: JSON.stringify(data) }
			}

			return { failure: new UnauthorizedException() }
		} catch (error) {
			return { failure: new UnauthorizedException() }
		}
	}
}
