import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import TelegramBot from 'node-telegram-bot-api';
import { ReviewStatusEnum } from '../../../database/enums/review-status.enum';
import { strategy } from 'sharp';
import { ReviewStrategyInterface } from '../interfaces/review-strategy.interface';
import { ProjectReviewStrategy } from '../strategies/project-review.strategy';
import { NewReviewInterface } from '../interfaces/new-review.interface';

@Injectable()
export class TelegramReviewService implements OnModuleInit {
    private readonly strategies: ReviewStrategyInterface[];
    private readonly bot: TelegramBot;

    public constructor(
        private telegramBotService: TelegramBotService,
        private projectReviewStrategy: ProjectReviewStrategy,
    ) {
        this.bot = telegramBotService.getBot();
        this.strategies = [projectReviewStrategy];
    }

    onModuleInit(): any {
        // Accept & Decline hooks
        this.bot.on('callback_query', async (query) => {
            const text = query.message.text;
            const strategy = this.findStrategy(text);
            if (!strategy) return;

            const status = query.data as ReviewStatusEnum;
            const { id } = strategy.read(text);

            const result = await strategy.writeAndPersist(id, status, query.from.username);

            await this.bot.editMessageText(result, {
                parse_mode: 'MarkdownV2',
                chat_id: this.telegramBotService.getChat(),
                message_id: query.message.message_id,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
        });

        // Custom review reason
        this.bot.on('text', async (message) => {
            const origin = message.reply_to_message;
            if (!origin) return;

            const strategy = this.findStrategy(origin.text);
            if (!strategy) return;

            const { id } = strategy.read(origin.text);
            const result = await strategy.writeAndPersist(
                id,
                null,
                message.from.username,
                message.text,
            );

            await this.bot.editMessageText(result, {
                parse_mode: 'MarkdownV2',
                chat_id: this.telegramBotService.getChat(),
                message_id: origin.message_id,
            });
        });
    }

    public async requestReview(request: NewReviewInterface) {
        await this.telegramBotService.sendChannelMessage(request.initialWriter(), {
            parse_mode: 'MarkdownV2',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Approve',
                            callback_data: 'accepted',
                        },
                        {
                            text: 'Decline',
                            callback_data: 'declined',
                        },
                    ],
                ],
            },
        });
    }

    private findStrategy(text: string): ReviewStrategyInterface | undefined {
        for (const strategy of this.strategies) {
            if (strategy.canHandle(text)) {
                return strategy;
            }
        }

        console.debug('Cant find appropriate strategy for text: ', strategy);
        return null;
    }
}
