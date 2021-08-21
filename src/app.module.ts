import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { DaoProposalsModule } from './dao-proposals/dao-proposals.module';
import { MetricsModule } from './metrics/metrics.module';
import { PagesModule } from './pages/pages.module';
import { AirtableModule } from './airtable/airtable.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: `./enviroment/${process.env.NODE_ENV}.env` });
}

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                `./${process.env.NODE_ENV}.env`,
                `./enviroment/${process.env.NODE_ENV}.env`,
            ],
        }),
        MongooseModule.forRoot(process.env.MONGO_URL as string, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        ProjectsModule,
        DaoProposalsModule,
        MetricsModule,
        PagesModule,
        AirtableModule,
        AccountModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
