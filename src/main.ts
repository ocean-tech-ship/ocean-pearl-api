import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AssociatedProject } from './account/models/associated-project.model';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Ocean Pearl API')
        .setDescription('Public API endpoint of the Ocean-Pearl project')
        .setVersion('1.0')
        .addCookieAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [AssociatedProject],
    });
    SwaggerModule.setup('api', app, document);

    const configService = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: configService.get('ORIGIN'), credentials: true });
    app.use(cookieParser());

    await app.listen(configService.get('PORT') || 3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
