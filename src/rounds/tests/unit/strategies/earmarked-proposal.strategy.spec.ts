import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmarked-proposal.strategy';

describe('EarmarkedPropsoalStrategy', () => {
    let module: TestingModule;
    let service: EarmarkedPropsoalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
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
        'should not be able to handle: not earmarked': {
            proposal: {
                isEarmarked: false,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
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
        'should not be able to handle: negative effective votes': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                effectiveVotes: -1000,
                yesVotes: 10000,
                noVotes: 11000,
            } as LeaderboardProposal,
            leaderboard: {
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
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
        'should not be able to handle: no overall funding left': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                receivedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 0,
                        remainingFunding: 0,
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
    };

    const executeDataProvider = {
        'it should receive full funding from earmark pool': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                grantPoolShare: {},
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                        potentialRemainingFunding: 20000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.NewEntrants]: 20000,
                            },
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    partiallyFundedProposals: [],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 20000,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 100000,
                            remainingFunding: 100000,
                        },
                    },
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive full funding from general pool': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 0,
                effectiveVotes: 210000,
                grantPoolShare: {},
                yesVotes: 300000,
                noVotes: 90000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 20000,
                            },
                            effectiveVotes: 210000,
                            yesVotes: 300000,
                            noVotes: 90000,
                        },
                    ],
                    partiallyFundedProposals: [],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 20000,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 100000,
                            remainingFunding: 80000,
                        },
                    },
                    maxVotes: 300000,
                } as Leaderboard,
                lowestEarmarkVotes: 210000,
            },
        },
        'it should receive full funding from mixed pool': {
            proposal: {
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 90000,
                grantPoolShare: {},
                yesVotes: 100000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                        potentialRemainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 10000,
                                [EarmarkTypeEnum.NewEntrants]: 10000,
                            },
                            effectiveVotes: 90000,
                            yesVotes: 100000,
                            noVotes: 10000,
                        },
                    ],
                    partiallyFundedProposals: [],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 10000,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 100000,
                            remainingFunding: 90000,
                        },
                    },
                    maxVotes: 100000,
                } as Leaderboard,
                lowestEarmarkVotes: 90000,
            },
        },
        'it should receive partial funding from earmark pool': {
            proposal: {
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                grantPoolShare: {},
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
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
                        yesVotes: 210000,
                        noVotes: 10000,
                    },
                ],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 19000,
                        potentialRemainingFunding: 19000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 20000,
                            },
                            effectiveVotes: 210000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    partiallyFundedProposals: [
                        {
                            id: '1',
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 19000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.NewEntrants]: 19000,
                            },
                            effectiveVotes: 200000,
                            neededVotes: {
                                fullyFunded: 10001,
                            },
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 0,
                            remainingFunding: 0,
                        },
                    },
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive partial funding from general pool': {
            proposal: {
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 0,
                grantPoolShare: {},
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
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
                        yesVotes: 210000,
                        noVotes: 10000,
                    },
                ],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 20000,
                            },
                            effectiveVotes: 210000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    partiallyFundedProposals: [
                        {
                            id: '1',
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 8000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 8000,
                            },
                            neededVotes: {
                                fullyFunded: 10001,
                            },
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 8000,
                            remainingFunding: 0,
                        },
                    },
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive partial funding from mixed pool': {
            proposal: {
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                grantPoolShare: {},
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
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
                        yesVotes: 210000,
                        noVotes: 10000,
                    },
                ],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                        potentialRemainingFunding: 8000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    },
                },
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 20000,
                            },
                            effectiveVotes: 210000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    partiallyFundedProposals: [
                        {
                            id: '1',
                            isEarmarked: true,
                            earmarkType: EarmarkTypeEnum.NewEntrants,
                            requestedFunding: 20000,
                            receivedFunding: 16000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 8000,
                                [EarmarkTypeEnum.NewEntrants]: 8000,
                            },
                            neededVotes: {
                                fullyFunded: 10001,
                            },
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 8000,
                            remainingFunding: 0,
                            potentialRemainingFunding: 0,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 8000,
                            remainingFunding: 0,
                        },
                    },
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<EarmarkedPropsoalStrategy>(EarmarkedPropsoalStrategy);
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

            expect(result).toEqual(expected.leaderboard);
        },
    );
});
