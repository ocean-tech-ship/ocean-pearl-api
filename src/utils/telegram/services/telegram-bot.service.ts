import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot = require('node-telegram-bot-api');
import { Message, SendMessageOptions } from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
    private readonly chat = this.configService.get('TELEGRAM_BOT_CHAT');
    private readonly bot = new TelegramBot(this.configService.get('TELEGRAM_BOT_TOKEN'), {
        polling: true,
    });

    public constructor(private configService: ConfigService) {}

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
