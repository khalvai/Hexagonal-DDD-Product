import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger'

export function SwaggerApiResponse<T>(
	{
		dto,
		isArray,
		statusCode,
		message,
		success
	}: { dto?: Type<T>; isArray?: boolean; statusCode?: HttpStatus; message?: string; success?: boolean } = {
		isArray: false,
		message: 'Success',
		success: true
	}
) {
	if (dto) {
		return applyDecorators(
			ApiExtraModels(dto),
			ApiResponse({
				status: statusCode ?? HttpStatus.OK,
				schema: {
					allOf: [
						{
							type: 'object',
							properties: {
								success: {
									type: 'boolean',
									example: true // The default value for success
								},
								message: {
									type: 'string',
									example: message
								},
								data: isArray
									? {
											type: 'array',
											items: { $ref: getSchemaPath(dto) }
									  }
									: { $ref: getSchemaPath(dto) }
							}
						}
					]
				}
			})
		)
	} else {
		return applyDecorators(
			ApiResponse({
				status: statusCode ?? HttpStatus.OK,
				schema: {
					properties: {
						success: {
							type: 'boolean',
							example: success
							// The default value for success
						},
						message: {
							type: 'string',
							example: message
						}
					}
				}
			})
		)
	}
}
