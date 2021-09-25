import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
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

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`./environment/${process.env.NODE_ENV}.env`, '.env'],
            cache: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                console.log(
                    'MONGO_URL = ',
                    configService.get<string>('MONGO_URL'),
                );
                return {
                    uri: configService.get<string>('MONGO_URL'),
                    useCreateIndex: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    bufferCommands: false,
                    bufferMaxEntries: 0,
                };
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        ProjectsModule,
        DaoProposalsModule,
        MetricsModule,
        PagesModule,
        AirtableModule,
        RoundsModule,
        AwsModule,
        AccountModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
