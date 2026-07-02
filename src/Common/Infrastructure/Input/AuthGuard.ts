import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Request } from 'express'
import { TokenService } from 'src/Common/Application/Output/TokenService'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@Inject(TokenService) private readonly tokenService: TokenService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const token = this.extractTokenFromHeader(request)

		if (!token) {
			return false
		}
		const verifyResult = await this.tokenService.verify(token)

		if ('failure' in verifyResult) {
			throw verifyResult.failure
		}

		request['userId'] = JSON.parse(verifyResult.ok)['userId']

		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
