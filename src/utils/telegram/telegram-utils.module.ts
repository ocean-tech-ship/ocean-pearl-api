import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotService } from './services/telegram-bot.service';
import { TelegramReviewService } from './services/telegram-review.service';
import { DatabaseModule } from '../../database/database.module';
import { ProjectReviewStrategy } from './strategies/project-review.strategy';

@Module({
    imports: [ConfigModule, DatabaseModule],
    providers: [TelegramBotService, TelegramReviewService, ProjectReviewStrategy],
    exports: [TelegramBotService, TelegramReviewService],
})
export class TelegramUtilsModule {}
