import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('WontReceiveFundingStrategy', () => {
    let module: TestingModule;
    let service: WontReceiveFundingStrategy;

    const canHandleDataProvider = {
        'should be able to handle: negative effective votes': {
            proposal: {
                effectiveVotes: -100000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    },
                },
            } as Leaderboard,
            expected: true,
        },
        'should be able to handle: no earmarked funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: true,
        },
        'should be able to handle: no general funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: true,
        },
        'should not be able to handle: earmarked project with earmarked funding left': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                effectiveVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: false,
        },
        'should not be able to handle: earmarked project with general funding left': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                effectiveVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    },
                },
            } as Leaderboard,
            expected: false,
        },
        'should not be able to handle: general funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                    },
                },
            } as Leaderboard,
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should calculate needed votes for no funding left': {
            proposal: {
                id: '1',
                requestedFunding: 20000,
                receivedFunding: 0,
                effectiveVotes: 170000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                    },
                ],
                partiallyFundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    },
                ],
                notFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 30000,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: {
                fundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                    },
                ],
                partiallyFundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    },
                ],
                notFundedProposals: [
                    {
                        id: '1',
                        requestedFunding: 20000,
                        receivedFunding: 0,
                        effectiveVotes: 170000,
                        neededVotes: {
                            fullyFunded: 40001,
                            partiallyFunded: 30001,
                        },
                    },
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 30000,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
        },
        'it should calculate needed votes for negative effective votes with funding left': {
            proposal: {
                id: '1',
                requestedFunding: 20000,
                receivedFunding: 0,
                effectiveVotes: -20000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                    },
                ],
                partiallyFundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    },
                ],
                notFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 8000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 60000,
                        remainingFunding: 30000,
                    },
                },
            } as Leaderboard,
            expected: {
                fundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                    },
                ],
                partiallyFundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 10000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 10000,
                        },
                        effectiveVotes: 200000,
                    },
                ],
                notFundedProposals: [
                    {
                        id: '1',
                        requestedFunding: 20000,
                        receivedFunding: 0,
                        effectiveVotes: -20000,
                        neededVotes: {
                            fullyFunded: 20001,
                        },
                    },
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 8000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 60000,
                        remainingFunding: 30000,
                    },
                },
            } as Leaderboard,
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
