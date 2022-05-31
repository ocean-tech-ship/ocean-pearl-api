import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { LegacyEarmarkedProposalStrategy } from '../../../strategies/legacy-earmarked-proposal.strategy';

describe('LegacyEarmarkedProposalStrategy', () => {
    let module: TestingModule;
    let service: LegacyEarmarkedProposalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            expected: true,
        },
        'should not be able to handle: not earmarked': {
            proposal: new LeaderboardProposal(),
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding from earmark pool': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 20000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 20000,
                        potentialRemainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
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
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive full funding from general pool': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 20000,
                effectiveVotes: 210000,
                yesVotes: 300000,
                noVotes: 90000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
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
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 80000,
                    }),
                },
                maxVotes: 300000,
            }),
        },
        'it should receive full funding from mixed pool': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 20000,
                effectiveVotes: 90000,
                yesVotes: 100000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 10000,
                        potentialRemainingFunding: 10000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
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
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        remainingFunding: 90000,
                    }),
                },
                maxVotes: 100000,
            }),
        },
        'it should receive partial funding from earmark pool': {
            proposal: new LeaderboardProposal({
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 19000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 19000,
                        remainingFunding: 19000,
                        potentialRemainingFunding: 19000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        id: '1',
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        receivedFunding: 19000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.NewEntrants]: 19000,
                        },
                        effectiveVotes: 200000,
                        yesVotes: 210000,
                        noVotes: 10000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 19000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive partial funding from general pool': {
            proposal: new LeaderboardProposal({
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 8000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 19000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        id: '1',
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        receivedFunding: 8000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 8000,
                        },
                        effectiveVotes: 200000,
                        yesVotes: 210000,
                        noVotes: 10000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 19000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive partial funding from mixed pool': {
            proposal: new LeaderboardProposal({
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                receivedFunding: 16000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                        potentialRemainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: '2',
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 210000,
                        yesVotes: 210000,
                        noVotes: 0,
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        id: '1',
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        receivedFunding: 16000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 8000,
                            [EarmarkTypeEnum.NewEntrants]: 8000,
                        },
                        effectiveVotes: 200000,
                        yesVotes: 210000,
                        noVotes: 10000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 19000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 0,
                        remainingFunding: 0,
                    }),
                },
                maxVotes: 210000,
            }),
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LegacyEarmarkedProposalStrategy>(LegacyEarmarkedProposalStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(canHandleDataProvider))(
        '%s',
        (description, { proposal, expected }) => {
            expect(service.canHandle(proposal)).toEqual(expected);
        },
    );

    it.each(Object.entries(executeDataProvider))(
        '%s',
        (description, { proposal, leaderboard, expected }) => {
            let result: Leaderboard = service.execute(proposal, leaderboard);

            expect(result).toEqual(leaderboard);
        },
    );
});
