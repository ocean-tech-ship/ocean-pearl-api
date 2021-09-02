import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AssociatedProject } from './account/models/associated-project.model';

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

    await app.listen(process.env.PORT || 3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
