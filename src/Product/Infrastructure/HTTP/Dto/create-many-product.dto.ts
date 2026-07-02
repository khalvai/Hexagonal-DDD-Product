import { ApiProperty } from '@nestjs/swagger'

export class CreateManyProductDTO {
	@ApiProperty({ type: 'string', format: 'binary', required: true })
	file: any
}
