import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { LeaderboardProposalBuilder } from '../../builder/leaderboard-proposal.builder';
import { LeaderboardController } from '../../controller/leaderboard.controller';
import { GenerateLeaderboardService } from '../../services/generate-leaderboard.service';
import { GetCurrentRoundService } from '../../services/get-current-round.service';
import { EarmarkedPropsoalStrategy } from '../../strategies/earmaked-proposal.strategy';
import { GeneralPropsoalStrategy } from '../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from '../../strategies/wont-receive-funding.strategy';

describe('LeaderboardController', () => {
    let module: TestingModule;
    let controller: LeaderboardController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule],
            controllers: [LeaderboardController],
            providers: [
                GetCurrentRoundService,
                GenerateLeaderboardService,
                LeaderboardProposalBuilder,
                LeaderboardStrategyCollection,
                EarmarkedPropsoalStrategy,
                GeneralPropsoalStrategy,
                WontReceiveFundingStrategy,
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
