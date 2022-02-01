import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedProposalStrategy } from '../../../strategies/earmarked-proposal.strategy';
import { GeneralProposalStrategy } from '../../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../../strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('LeaderboardStrategyCollection', () => {
    let module: TestingModule;
    let service: LeaderboardStrategyCollection;

    const findMatchingStrategyDataProvider = {
        'it should return the earmarked strategy: remaining earmarked funding': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: EarmarkedProposalStrategy,
        },
        'it should return the earmarked strategy: remaining general funding': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                },
            }),
            expected: EarmarkedProposalStrategy,
        },
        'it should return the general strategy': {
            proposal: new LeaderboardProposal({
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                },
            }),
            expected: GeneralProposalStrategy,
        },
        'it should return the wont receive funding strategy: negative effective votes': {
            proposal: new LeaderboardProposal({
                requestedFunding: 20000,
                effectiveVotes: -10000,
                yesVotes: 0,
                noVotes: 100000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: WontReceiveFundingStrategy,
        },
        'it should return the wont receive funding strategy: earmarked with no funding': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 20000,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: WontReceiveFundingStrategy,
        },
        'it should return the wont receive funding strategy: general with no funding': {
            proposal: new LeaderboardProposal({
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 20000,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: WontReceiveFundingStrategy,
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LeaderboardStrategyCollection>(LeaderboardStrategyCollection);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(findMatchingStrategyDataProvider))(
        '%s',
        (description, { proposal, leaderboard, expected }) => {
            expect(service.findMatchingStrategy(proposal, leaderboard)).toBeInstanceOf(expected);
        },
    );
});
