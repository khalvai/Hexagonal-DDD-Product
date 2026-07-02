import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getThemeAsync } from '@intelika/swagger-theme'

export async function setupDocument(app: INestApplication, route: string) {
	const description = [`🍕  documentation`]

	const configDocument = new DocumentBuilder()
		.setTitle('assignmentl')
		.setDescription(description.join('\r\n\r\n'))
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http',
			scheme: 'Bearer',
			bearerFormat: 'JWT'
		})
		.build()

	const document = SwaggerModule.createDocument(app, configDocument)
	const style: Buffer = await getThemeAsync()
	SwaggerModule.setup(route, app, document, {
		customCss: style.toString()
	})
}
