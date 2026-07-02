import { LoginQuery } from 'src/User/Application/Queries/LoginQuery'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDTO implements LoginQuery {
	@ApiProperty({
		required: true,
		example: 'Khalvayozbek@gmail.com'
	})
	email: string
	@ApiProperty({
		required: true,
		example: 'SOME_STRONG_PASSWORD',
		description: 'length must be between 8 and 20 characters'
	})
	password: string
}
