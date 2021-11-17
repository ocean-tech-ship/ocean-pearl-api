import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { LeaderboardStrategyResponse } from '../../../interfaces/leaderboard-strategy.interface';
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
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                },
                remainingGeneralFunding: 10000,
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
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                },
                remainingGeneralFunding: 10000,
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
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 10000,
                    },
                },
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 210000,
                yesVotes: 300000,
                noVotes: 90000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 20000,
                    },
                },
                remainingGeneralFunding: 100000,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            effectiveVotes: 210000,
                            yesVotes: 300000,
                            noVotes: 90000,
                        },
                    ],
                    earmarks: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            remainingFunding: 20000,
                        },
                    },
                    remainingGeneralFunding: 80000,
                    maxVotes: 300000,
                } as Leaderboard,
                lowestGeneralVotes: 210000,
            },
        },
        'it should receive partial funding': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 8000,
                    },
                },
                remainingGeneralFunding: 8000,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 8000,
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    earmarks: {
                        [EarmarkTypeEnum.NewEntrants]: {
                            type: EarmarkTypeEnum.NewEntrants,
                            remainingFunding: 8000,
                        },
                    },
                    remainingGeneralFunding: 0,
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
            let lowestEarmark,
                lowestGeneral: number = 4000000;

            let result: LeaderboardStrategyResponse = service.execute(
                proposal,
                leaderboard,
                lowestEarmark,
                lowestGeneral,
            );

            expect(result.leaderboard).toEqual(expected.leaderboard);
            expect(result.lowestGeneralVotes).toEqual(
                expected.lowestGeneralVotes,
            );
        },
    );
});
