import { HttpException, HttpStatus, ParseFilePipeBuilder, UploadedFile } from '@nestjs/common'

export function UploadedFilePipe(mbSize: number = 2, required: boolean = true): any {
	return UploadedFile(
		new ParseFilePipeBuilder()
			.addFileTypeValidator({
				fileType: '.(csv)'
			})
			.addMaxSizeValidator({
				maxSize: mbSize * 1024 * 1024
			})
			.build({
				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				fileIsRequired: required,
				exceptionFactory: error => new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
			})
	)
}
