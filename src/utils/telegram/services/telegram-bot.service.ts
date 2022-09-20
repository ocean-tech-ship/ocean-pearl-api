import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot = require('node-telegram-bot-api');
import { Message, SendMessageOptions } from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
    private readonly chat: string | undefined;
    private readonly bot: TelegramBot | undefined;

    public constructor(private configService: ConfigService) {
        const chat = this.configService.get('TELEGRAM_BOT_CHAT');
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');

        if (chat && token) {
            this.chat = chat;
            this.bot = new TelegramBot(token, {
                polling: true,
            });
        }
    }

    getBot(): TelegramBot {
        return this.bot;
    }

    getChat(): string {
        return this.chat;
    }

    public async sendMessage(
        chatId: string,
        text: string,
        options?: SendMessageOptions,
    ): Promise<Message> {
        return this.bot.sendMessage(chatId, text, options);
    }

    public async sendChannelMessage(text: string, options?: SendMessageOptions): Promise<Message> {
        return this.sendMessage(this.chat, text, options);
    }
}
