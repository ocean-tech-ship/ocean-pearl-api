import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { LeaderboardCacheService } from '../../../services/leaderboard-cache.service';

describe('LeaderboardCacheService', () => {
    let module: TestingModule;
    let service: LeaderboardCacheService;
    let leaderboard: Leaderboard;

    let votingStartDate = new Date();
    votingStartDate.setHours(votingStartDate.getHours() - 2);
    let votingEndDate = new Date();
    votingEndDate.setHours(votingStartDate.getHours() + 2);

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, CacheModule.register()],
            providers: [LeaderboardCacheService],
        }).compile();

        service = module.get<LeaderboardCacheService>(LeaderboardCacheService);

        leaderboard = new Leaderboard({
            amountProposals: 6,
            overallFunding: 100000,
            overallRequestedFunding: 230000,
            round: 10,
            totalVotes: 805000,
            grantPools: {
                [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                    type: EarmarkTypeEnum.NewEntrants,
                    totalFunding: 20000,
                    remainingFunding: 20000,
                }),
                [EarmarkTypeEnum.General]: new GrantPool({
                    type: EarmarkTypeEnum.NewEntrants,
                    totalFunding: 80000,
                    remainingFunding: 80000,
                }),
            },
            paymentOption: PaymentOptionEnum.Usd,
            status: RoundStatusEnum.VotingInProgress,
            votingStartDate: votingStartDate,
            votingEndDate: votingEndDate,
            maxVotes: 200000,
        });
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add a leaderboard to the cache', () => {
        service.addToCache(leaderboard);

        expect(service.getFromCache(leaderboard.round)).resolves.toEqual(leaderboard);
    });

    it('should remove the leaderboard', () => {
        service.removeFromCache(leaderboard.round);

        expect(service.getFromCache(leaderboard.round)).resolves.toBeUndefined();
    });
});
