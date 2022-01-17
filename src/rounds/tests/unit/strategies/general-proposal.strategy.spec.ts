import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { GeneralPropsoalStrategy } from '../../../strategies/general-proposal.strategy';

describe('GeneralPropsoalStrategy', () => {
    let module: TestingModule;
    let service: GeneralPropsoalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: {
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
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
        'should not be able to handle: negative effective votes': {
            proposal: {
                effectiveVotes: -1000,
                yesVotes: 0,
                noVotes: 1000,
            } as LeaderboardProposal,
            leaderboard: {
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
            expected: false,
        },
        'should not be able to handle: no general funding left': {
            proposal: {
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 10000,
                        remainingFunding: 0,
                    },
                },
            } as Leaderboard,
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding': {
            proposal: {
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
                        remainingFunding: 20000,
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
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            effectiveVotes: 210000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 20000,
                            },
                            yesVotes: 300000,
                            noVotes: 90000,
                        },
                    ],
                    partiallyFundedProposals: [],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 20000,
                            remainingFunding: 20000,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 100000,
                            remainingFunding: 80000,
                        },
                    },
                    maxVotes: 300000,
                } as Leaderboard,
                lowestGeneralVotes: 210000,
            },
        },
        'it should receive partial funding': {
            proposal: {
                requestedFunding: 20000,
                receivedFunding: 0,
                effectiveVotes: 200000,
                grantPoolShare: {},
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                partiallyFundedProposals: [],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 8000,
                        remainingFunding: 8000,
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
                    fundedProposals: [],
                    partiallyFundedProposals: [
                        {
                            effectiveVotes: 200000,
                            grantPoolShare: {
                                [EarmarkTypeEnum.General]: 8000,
                            },
                            neededVotes: {
                                fullyFunded: undefined,
                                partiallyFunded: undefined,
                            },
                            noVotes: 10000,
                            receivedFunding: 8000,
                            requestedFunding: 20000,
                            yesVotes: 210000,
                        },
                    ],
                    grantPools: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            totalFunding: 8000,
                            remainingFunding: 8000,
                        },
                        [EarmarkTypeEnum.General]: {
                            type: EarmarkTypeEnum.General,
                            totalFunding: 8000,
                            remainingFunding: 0,
                        },
                    },
                    maxVotes: 210000,
                } as Leaderboard,
                lowestGeneralVotes: 200000,
            },
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<GeneralPropsoalStrategy>(GeneralPropsoalStrategy);
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
