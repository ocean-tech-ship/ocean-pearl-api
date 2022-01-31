import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('WontReceiveFundingStrategy', () => {
    let module: TestingModule;
    let service: WontReceiveFundingStrategy;

    const canHandleDataProvider = {
        'should be able to handle: negative effective votes': {
            proposal: new LeaderboardProposal({
                requestedFunding: 3000,
                effectiveVotes: -100000,}),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                },
            }),
            expected: true,
        },
        'should be able to handle: no earmarked funding left': {
            proposal: new LeaderboardProposal({
                
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 3000,
                effectiveVotes: 100000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: true,
        },
        'should be able to handle: no general funding left': {
            proposal: new LeaderboardProposal({
                requestedFunding: 3000,effectiveVotes: 100000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: true,
        },
        'should not be able to handle: earmarked project with earmarked funding left': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 3000,
                effectiveVotes: 10000,}),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: false,
        },
        'should not be able to handle: earmarked project with general funding left': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 3000,
                effectiveVotes: 10000,}),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                },
            }),
            expected: false,
        },
        'should not be able to handle: general funding left': {
            proposal: new LeaderboardProposal({
                requestedFunding: 3000,effectiveVotes: 100000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    }),
                },
            }),
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should calculate needed votes for no funding left': {
            proposal: new LeaderboardProposal({
                id: '1',
                requestedFunding: 20000,
                effectiveVotes: 170000,
            }),
            leaderboard: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        effectiveVotes: 210000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 30000,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        effectiveVotes: 210000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    }),
                ],
                notFundedProposals: [
                    new LeaderboardProposal({
                        id: '1',
                        requestedFunding: 20000,
                        effectiveVotes: 170000,
                        neededVotes: {
                            fullyFunded: 40001,
                            partiallyFunded: 30001,
                        },
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 30000,
                        remainingFunding: 0,
                    }),
                },
            }),
        },
        'it should calculate needed votes for negative effective votes with funding left': {
            proposal: new LeaderboardProposal({
                id: '1',
                requestedFunding: 20000,
                effectiveVotes: -20000,
            }),
            leaderboard: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        effectiveVotes: 210000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 60000,
                        remainingFunding: 30000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        effectiveVotes: 210000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    }),
                ],
                notFundedProposals: [
                    new LeaderboardProposal({
                        id: '1',
                        requestedFunding: 20000,
                        effectiveVotes: -20000,
                        neededVotes: {
                            fullyFunded: 20001,
                        },
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 60000,
                        remainingFunding: 30000,
                    }),
                },
            }),
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<WontReceiveFundingStrategy>(WontReceiveFundingStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(canHandleDataProvider))(
        '%s',
        (description, { proposal, leaderboard, expected }) => {
            expect(service.canHandle(proposal, leaderboard)).toEqual(expected);
        },
    );

    it.each(Object.entries(executeDataProvider))(
        '%s',
        (description, { proposal, leaderboard, expected }) => {
            let result: Leaderboard = service.execute(proposal, leaderboard);

            expect(result).toEqual(expected);
        },
    );
});
