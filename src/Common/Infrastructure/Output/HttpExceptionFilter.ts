import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import Exception from '../../Domain/Exceptions/Exception'
import NotValidInputException from '../../Domain/Exceptions/NotValidInput'
import AlreadyExistsException from '../../Domain/Exceptions/AlreadyExistsException'
import { InValidOperationException } from 'src/Common/Domain/Exceptions/InValidOperationException'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: Exception, host: ArgumentsHost): any {
		const { httpAdapter } = this.httpAdapterHost

		const ctx = host.switchToHttp()
		let message: any = 'INTERNAL_SERVER_ERROR'
		let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR

		if (exception instanceof HttpException && exception.getStatus() !== 500) {
			message = exception.getResponse()
		}

		if (exception instanceof NotValidInputException) {
			message = exception.errorMessages
			httpStatus = HttpStatus.BAD_REQUEST
		}

		if (exception instanceof NotFoundException) {
			message = exception.message
			httpStatus = HttpStatus.NOT_FOUND
		}
		if (exception instanceof AlreadyExistsException) {
			message = exception.message
			httpStatus = HttpStatus.BAD_REQUEST
		}

		if (exception instanceof InValidOperationException) {
			message = exception.message
			httpStatus = HttpStatus.BAD_REQUEST
		}
		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
			message
		}

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)

		if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
			const requestDetail = {
				path: httpAdapter.getRequestUrl(ctx.getRequest()),
				method: httpAdapter.getRequestMethod(ctx.getRequest()),
				error: exception
			}
			console.log(requestDetail)
		}
	}
}
