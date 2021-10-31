import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardStrategyResponse } from '../../../interfaces/leaderboard-strategy.interface';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmaked-proposal.strategy';

describe('EarmarkedPropsoalStrategy', () => {
    let module: TestingModule;
    let service: EarmarkedPropsoalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: {
                isEarmarked: true,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 10000,
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
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 10000,
            } as Leaderboard,
            expected: false,
        },
        'should not be able to handle: negative effective votes': {
            proposal: {
                isEarmarked: true,
                effectiveVotes: -1000,
                yesVotes: 10000,
                noVotes: 11000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 10000,
            } as Leaderboard,
            expected: false,
        },
        'should not be able to handle: no overall funding left': {
            proposal: {
                isEarmarked: true,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding from earmark pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 20000,
                remainingGeneralFunding: 100000,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 100000,
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive full funding from general pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 210000,
                yesVotes: 300000,
                noVotes: 90000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 0,
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
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 80000,
                    maxVotes: 300000,
                } as Leaderboard,
                lowestEarmarkVotes: 210000,
            },
        },
        'it should receive full funding from mixed pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 90000,
                yesVotes: 100000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 100000,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 20000,
                            effectiveVotes: 90000,
                            yesVotes: 100000,
                            noVotes: 10000,
                        },
                    ],
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 90000,
                    maxVotes: 100000,
                } as Leaderboard,
                lowestEarmarkVotes: 90000,
            },
        },
        'it should receive partial funding from earmark pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 19000,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 19000,
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 0,
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive partial funding from general pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 0,
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
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 0,
                    maxVotes: 210000,
                } as Leaderboard,
                lowestEarmarkVotes: 200000,
            },
        },
        'it should receive partial funding from mixed pool': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            } as LeaderboardProposal,
            leaderboard: {
                fundedProposals: [],
                remainingEarmarkFunding: 8000,
                remainingGeneralFunding: 8000,
            } as Leaderboard,
            expected: {
                leaderboard: {
                    fundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 16000,
                            effectiveVotes: 200000,
                            yesVotes: 210000,
                            noVotes: 10000,
                        },
                    ],
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 0,
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

        service = module.get<EarmarkedPropsoalStrategy>(
            EarmarkedPropsoalStrategy,
        );
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
            expect(result.lowestEarmarkVotes).toEqual(
                expected.lowestEarmarkVotes,
            );
        },
    );
});
