import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LeaderboardController } from './controller/leaderboard.controller';
import { LeaderboardProposalBuilder } from './builder/leaderboard-proposal.builder';
import { GenerateLeaderboardService } from './services/generate-leaderboard.service';
import { GetCurrentRoundService } from './services/get-current-round.service';
import { EarmarkedPropsoalStrategy } from './strategies/earmarked-proposal.strategy';
import { GeneralPropsoalStrategy } from './strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from './strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from './strategies/wont-receive-funding.strategy';
import { LeaderboardMapper } from './mapper/leaderboard.mapper';

@Module({
    controllers: [LeaderboardController],
    imports: [DatabaseModule],
    providers: [
        GetCurrentRoundService,
        GenerateLeaderboardService,
        LeaderboardMapper,
        LeaderboardProposalBuilder,
        LeaderboardStrategyCollection,
        EarmarkedPropsoalStrategy,
        GeneralPropsoalStrategy,
        WontReceiveFundingStrategy,
    ],
    exports: [GetCurrentRoundService],
})
export class RoundsModule {}
