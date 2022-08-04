import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AssociatedProject } from './account/models/associated-project.model';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Pagination } from './database/models/pagination.model';
import { Leaderboard } from './rounds/models/leaderboard.model';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Ocean Pearl API')
        .setDescription('Public API endpoint of the Ocean-Pearl project.')
        .setVersion('1.0')
        .addCookieAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [AssociatedProject, Pagination, Leaderboard],
    });
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: true, credentials: true });
    app.use(cookieParser());

    const configService = app.get<ConfigService>(ConfigService);

    await app.listen(configService.get('PORT') || 3001);
    Logger.log(
        `🚀 Application is running on: http://localhost:${configService.get('PORT') || 3001}`
      );
}
bootstrap();
