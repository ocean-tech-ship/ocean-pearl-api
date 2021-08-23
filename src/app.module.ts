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
import { RoundsModule } from './rounds/rounds.module';

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config();
} else {
    require('dotenv').config({ path: `./enviroment/${process.env.NODE_ENV}.env` });
}

@Module({
    imports: [
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
        RoundsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
