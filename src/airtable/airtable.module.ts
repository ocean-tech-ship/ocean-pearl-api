import { HttpModule, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AirtableUrlBuilder } from './builder/airtable-url.builder';
import { ProposalsProvider } from './provider/proposals.provider';
import { RoundsProvider } from './provider/rounds.provider';
import { SyncProposalsDataService } from './services/sync-proposals-data.service';
import { SyncRoundsDataService } from './services/sync-rounds-data.service';

@Module({
    imports: [HttpModule, DatabaseModule],
    providers: [
        SyncProposalsDataService,
        SyncRoundsDataService,
        ProposalsProvider,
        RoundsProvider,
        AirtableUrlBuilder,
    ],
    exports: [ProposalsProvider, RoundsProvider],
})
export class AirtableModule {}
