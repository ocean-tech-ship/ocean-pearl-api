import { CacheModule, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LeaderboardProposalBuilder } from './builder/leaderboard-proposal.builder';
import { LeaderboardController } from './controller/leaderboard.controller';
import { LeaderboardMapper } from './mapper/leaderboard.mapper';
import { CalculateNeededVotesService } from './services/calculate-needed-votes.service';
import { GenerateLeaderboardService } from './services/generate-leaderboard.service';
import { GenerateLegacyLeaderboardService } from './services/generate-legacy-leaderboard.service';
import { GetCurrentRoundService } from './services/get-current-round.service';
import { LeaderboardCacheService } from './services/leaderboard-cache.service';
import { EarmarkedProposalStrategy } from './strategies/earmarked-proposal.strategy';
import { GeneralProposalStrategy } from './strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from './strategies/leaderboard-strategy.collection';
import { LegacyEarmarkedProposalStrategy } from './strategies/legacy-earmarked-proposal.strategy';
import { LegacyGeneralProposalStrategy } from './strategies/legacy-general-proposal.strategy';
import { LegacyLeaderboardStrategyCollection } from './strategies/legacy-leaderboard-strategy.collection';

@Module({
    controllers: [LeaderboardController],
    imports: [CacheModule.register(), DatabaseModule],
    providers: [
        GetCurrentRoundService,
        GenerateLeaderboardService,
        LeaderboardCacheService,
        CalculateNeededVotesService,
        LeaderboardMapper,
        LeaderboardProposalBuilder,
        LeaderboardStrategyCollection,
        EarmarkedProposalStrategy,
        GeneralProposalStrategy,
        LegacyLeaderboardStrategyCollection,
        LegacyEarmarkedProposalStrategy,
        LegacyGeneralProposalStrategy,
        GenerateLegacyLeaderboardService,
    ],
    exports: [GetCurrentRoundService],
})
export class RoundsModule {}
