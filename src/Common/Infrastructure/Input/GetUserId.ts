import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetUserId = createParamDecorator((data: unknown, context: ExecutionContext): string => {
	const request = context.switchToHttp().getRequest()
	const userId = request['userId']
	return userId
})
