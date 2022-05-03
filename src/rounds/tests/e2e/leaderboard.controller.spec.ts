import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { LeaderboardProposalBuilder } from '../../builder/leaderboard-proposal.builder';
import { LeaderboardController } from '../../controller/leaderboard.controller';
import { LeaderboardMapper } from '../../mapper/leaderboard.mapper';
import { CalculateNeededVotesService } from '../../services/calculate-needed-votes.service';
import { GenerateLeaderboardService } from '../../services/generate-leaderboard.service';
import { GenerateLegacyLeaderboardService } from '../../services/generate-legacy-leaderboard.service';
import { GetCurrentRoundService } from '../../services/get-current-round.service';
import { LeaderboardCacheService } from '../../services/leaderboard-cache.service';
import { EarmarkedProposalStrategy } from '../../strategies/earmarked-proposal.strategy';
import { GeneralProposalStrategy } from '../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../strategies/leaderboard-strategy.collection';
import { LegacyEarmarkedProposalStrategy } from '../../strategies/legacy-earmarked-proposal.strategy';
import { LegacyGeneralProposalStrategy } from '../../strategies/legacy-general-proposal.strategy';
import { LegacyLeaderboardStrategyCollection } from '../../strategies/legacy-leaderboard-strategy.collection';

describe('LeaderboardController', () => {
    let module: TestingModule;
    let controller: LeaderboardController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule, CacheModule.register()],
            controllers: [LeaderboardController],
            providers: [
                GetCurrentRoundService,
                GenerateLeaderboardService,
                CalculateNeededVotesService,
                LeaderboardMapper,
                LeaderboardProposalBuilder,
                LeaderboardStrategyCollection,
                LeaderboardCacheService,
                EarmarkedProposalStrategy,
                GeneralProposalStrategy,
                LegacyEarmarkedProposalStrategy,
                LegacyGeneralProposalStrategy,
                LegacyLeaderboardStrategyCollection,
                GenerateLegacyLeaderboardService,
            ],
        }).compile();

        controller = module.get<LeaderboardController>(LeaderboardController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
