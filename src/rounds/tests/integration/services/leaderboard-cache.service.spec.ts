import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { LeaderboardCacheService } from '../../../services/leaderboard-cache.service';

describe('LeaderboardCacheService', () => {
    let module: TestingModule;
    let service: LeaderboardCacheService;
    let leaderboard: Leaderboard;

    let voteStartDate = new Date();
    voteStartDate.setHours(voteStartDate.getHours() - 2);
    let voteEndDate = new Date();
    voteStartDate.setHours(voteStartDate.getHours() + 2);

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, CacheModule.register()],
            providers: [LeaderboardCacheService],
        }).compile();

        service = module.get<LeaderboardCacheService>(LeaderboardCacheService);

        leaderboard = {
            fundedProposals: [],
            notFundedProposals: [],
            amountProposals: 6,
            overallFunding: 100000,
            overallRequestedFunding: 230000,
            round: 10,
            totalVotes: 805000,
            earmarks: {
                [EarmarkTypeEnum.NewEntrants]: {
                    type: EarmarkTypeEnum.NewEntrants,
                    remainingFunding: 0,
                },
            },
            remainingGeneralFunding: 0,
            paymentOption: PaymentOptionEnum.Usd,
            status: RoundStatusEnum.VotingInProgress,
            voteStartDate: voteStartDate,
            voteEndDate: voteEndDate,
            maxVotes: 200000,
        } as Leaderboard;
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add a leaderboard to the cache', () => {
        service.addToCache(leaderboard);

        expect(service.getFromCache(leaderboard.round)).resolves.toEqual(
            leaderboard,
        );
    });

    it('should remove the leaderboard', () => {
        service.removeFromCache(leaderboard.round);

        expect(
            service.getFromCache(leaderboard.round),
        ).resolves.toBeUndefined();
    });
});
