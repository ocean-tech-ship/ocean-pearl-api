import { Module } from '@nestjs/common';
import { DaoProposalsController } from './dao-proposals.controller';
import { GetDaoProposalsByRoundService } from './services/get-dao-proposals-by-round.service';
import { GetDaoProposalsPaginatedService } from './services/get-dao-proposals-paginated.service';
import { GetFilteredDaoProposalsService } from './services/get-filtered-dao-proposals.service';
import { GetDaoProposalByIdService } from './services/get-dao-proposal-by-id.service';
import { GetLatestDaoProposalsService } from './services/get-latest-dao-proposals.service';
import { GetOpenDaoProposalsService } from './services/get-open-dao-proposals.service';
import { DatabaseModule } from '../database/database.module';
import { RoundsModule } from '../rounds/rounds.module';

@Module({
    imports: [DatabaseModule, RoundsModule],
    controllers: [DaoProposalsController],
    providers: [
        GetDaoProposalsByRoundService,
        GetDaoProposalByIdService,
        GetDaoProposalsPaginatedService,
        GetFilteredDaoProposalsService,
        GetOpenDaoProposalsService,
        GetLatestDaoProposalsService,
    ],
    exports: [
        GetDaoProposalsByRoundService,
        GetDaoProposalByIdService,
        GetDaoProposalsPaginatedService,
        GetFilteredDaoProposalsService,
        GetOpenDaoProposalsService,
        GetLatestDaoProposalsService,
    ],
})
export class DaoProposalsModule {}
