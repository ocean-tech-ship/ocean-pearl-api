import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountModule } from './account/account.module';
import { AirtableModule } from './airtable/airtable.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { DaoProposalsModule } from './dao-proposals/dao-proposals.module';
import { DatabaseModule } from './database/database.module';
import { MetricsModule } from './metrics/metrics.module';
import { PagesModule } from './pages/pages.module';
import { ProjectsModule } from './projects/projects.module';
import { RoundsModule } from './rounds/rounds.module';
import { ImageUtilsModule } from './utils/image/image-utils.module';
import { WalletUtilsModule } from './utils/wallet/wallet-utils.module';
import { TelegramUtilsModule } from './utils/telegram/telegram-utils.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`./environment/${process.env.NODE_ENV}.env`, '.env'],
            cache: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URL'),
                bufferCommands: false,
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ttl: config.get('THROTTLE_TTL'),
                limit: config.get('THROTTLE_LIMIT'),
                ignoreUserAgents: [new RegExp('googlebot', 'gi'), new RegExp('bingbot', 'gi')],
            }),
        }),
        ScheduleModule.forRoot(),
        AccountModule,
        AirtableModule,
        AuthModule,
        AwsModule,
        DatabaseModule,
        DaoProposalsModule,
        MetricsModule,
        PagesModule,
        ProjectsModule,
        RoundsModule,
        ImageUtilsModule,
        WalletUtilsModule,
        TelegramUtilsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
