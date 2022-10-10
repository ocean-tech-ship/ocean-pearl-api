import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { AirtableUrlBuilder } from './builder/airtable-url.builder';
import { DaoProposalMapper } from './mapper/dao-proposal.mapper';
import { DeliverableMapper } from './mapper/deliverable.mapper';
import { ProjectMapper } from './mapper/project.mapper';
import { ProposalsProvider } from './provider/proposals.provider';
import { RoundsProvider } from './provider/rounds.provider';
import { SyncProposalsDataService } from './services/sync-proposals-data.service';
import { SyncRoundsDataService } from './services/sync-rounds-data.service';
import { MissmatchedProposalStrategy } from './strategies/missmatched-proposal.strategy';
import { NewProjectStrategy } from './strategies/new-project.strategy';
import { NewProposalStrategy } from './strategies/new-proposal.strategy';
import { SingleMissmatchedProposalStrategy } from './strategies/single-missmatched-proposal.strategy';
import { StrategyCollection } from './strategies/strategy.collection';
import { UpdateProposalStrategy } from './strategies/update-proposal.strategy';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './controllers/health.controller';
import { SyncProcessHealthService } from './services/sync-process-health.service';
import { WalletUtilsModule } from '../utils/wallet/wallet-utils.module';

@Module({
    imports: [HttpModule, DatabaseModule, WalletUtilsModule],
    controllers: [HealthController],
    providers: [
        SyncProposalsDataService,
        SyncRoundsDataService,
        SyncProcessHealthService,
        ProposalsProvider,
        RoundsProvider,
        AirtableUrlBuilder,
        DaoProposalMapper,
        ProjectMapper,
        DeliverableMapper,
        MissmatchedProposalStrategy,
        NewProjectStrategy,
        NewProposalStrategy,
        SingleMissmatchedProposalStrategy,
        StrategyCollection,
        UpdateProposalStrategy,
        ConfigService,
    ],
    exports: [
        ProposalsProvider,
        RoundsProvider,
        SyncProposalsDataService,
        SyncRoundsDataService,
        AirtableUrlBuilder,
    ],
})
export class AirtableModule {}
