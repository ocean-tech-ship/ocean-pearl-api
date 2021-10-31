import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardStrategyResponse } from '../../../interfaces/leaderboard-strategy.interface';
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
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 10000,
            } as Leaderboard,
            expected: true,
        },
        'should be able to handle: no earmarked funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: true,
        },
        'should be able to handle: no general funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 10000,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: true,
        },
        'should not be able to handle: earmarked project with earmarked funding left':
            {
                proposal: {
                    isEarmarked: true,
                    effectiveVotes: 10000,
                } as LeaderboardProposal,
                leaderboard: {
                    remainingEarmarkFunding: 10000,
                    remainingGeneralFunding: 0,
                } as Leaderboard,
                expected: false,
            },
        'should not be able to handle: earmarked project with general funding left':
            {
                proposal: {
                    isEarmarked: true,
                    effectiveVotes: 10000,
                } as LeaderboardProposal,
                leaderboard: {
                    remainingEarmarkFunding: 0,
                    remainingGeneralFunding: 10000,
                } as Leaderboard,
                expected: false,
            },
        'should not be able to handle: general funding left': {
            proposal: {
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 10000,
            } as Leaderboard,
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should calculate needed votes for no funding left': {
            proposal: {
                requestedFunding: 20000,
                receivedFunding: 0,
                effectiveVotes: 2100000,
                yesVotes: 3000000,
                noVotes: 900000,
            } as LeaderboardProposal,
            leaderboard: {
                notFundedProposals: [],
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: {
                notFundedProposals: [
                    {
                        requestedFunding: 20000,
                        receivedFunding: 0,
                        effectiveVotes: 2100000,
                        yesVotes: 3000000,
                        noVotes: 900000,
                        neededVotes: 1900000,
                    },
                ],
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 0,
            } as Leaderboard,
        },
        'it should calculate needed votes for negative effective votes with funding left':
            {
                proposal: {
                    requestedFunding: 20000,
                    receivedFunding: 0,
                    effectiveVotes: -2000000,
                    yesVotes: 100000,
                    noVotes: 2100000,
                } as LeaderboardProposal,
                leaderboard: {
                    notFundedProposals: [],
                    remainingEarmarkFunding: 8000,
                    remainingGeneralFunding: 8000,
                } as Leaderboard,
                expected: {
                    notFundedProposals: [
                        {
                            requestedFunding: 20000,
                            receivedFunding: 0,
                            effectiveVotes: -2000000,
                            yesVotes: 100000,
                            noVotes: 2100000,
                            neededVotes: 2000001,
                        },
                    ],
                    remainingEarmarkFunding: 8000,
                    remainingGeneralFunding: 8000,
                } as Leaderboard,
            },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<WontReceiveFundingStrategy>(
            WontReceiveFundingStrategy,
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

            expect(result.leaderboard).toEqual(expected);
        },
    );
});
