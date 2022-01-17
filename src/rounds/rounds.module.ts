import { CacheModule, Module } from '@nestjs/common';
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
import { LeaderboardCacheService } from './services/leaderboard-cache.service';
import { CalculateNeededVotesService } from './services/calculate-needed-votes.service';

@Module({
    controllers: [LeaderboardController],
    imports: [
        CacheModule.register(),
        DatabaseModule],
    providers: [
        GetCurrentRoundService,
        GenerateLeaderboardService,
        LeaderboardCacheService,
        CalculateNeededVotesService,
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
