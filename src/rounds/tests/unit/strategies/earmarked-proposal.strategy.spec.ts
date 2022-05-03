import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedProposalStrategy } from '../../../strategies/earmarked-proposal.strategy';

describe('EarmarkedProposalStrategy', () => {
    let module: TestingModule;
    let service: EarmarkedProposalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            expected: true,
        },
        'should not be able to handle: not earmarked': {
            proposal: new LeaderboardProposal({
                isEarmarked: false,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding from earmark pool': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                minimumRequestedFunding: 10000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 20000,
                        remainingFunding: 20000,
                        potentialRemainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 100000,
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
                        minimumRequestedFunding: 10000,
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
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 0,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive percentual funding from mixed pools': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                minimumRequestedFunding: 10000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        totalEffectiveVotes: 800000,
                        relevantEffectiveVotes: 800000,
                        relevantFunding: 20000,
                        remainingFunding: 20000,
                        potentialRemainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 2000000,
                        relevantEffectiveVotes: 2000000,
                        relevantFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
            }),
            expected: new Leaderboard({
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        minimumRequestedFunding: 10000,
                        receivedFunding: 15000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.NewEntrants]: 5000,
                            [EarmarkTypeEnum.General]: 10000,
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
                        totalEffectiveVotes: 800000,
                        relevantEffectiveVotes: 600000,
                        relevantFunding: 15000,
                        remainingFunding: 15000,
                        potentialRemainingFunding: 15000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 2000000,
                        relevantEffectiveVotes: 1800000,
                        relevantFunding: 90000,
                        remainingFunding: 90000,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive full funding from mixed pool': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                minimumRequestedFunding: 10000,
                effectiveVotes: 90000,
                yesVotes: 100000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 10000,
                        totalEffectiveVotes: 90000,
                        relevantEffectiveVotes: 90000,
                        relevantFunding: 10000,
                        remainingFunding: 10000,
                        potentialRemainingFunding: 10000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 90000,
                        relevantEffectiveVotes: 90000,
                        relevantFunding: 100000,
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
                        minimumRequestedFunding: 10000,
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
                        totalEffectiveVotes: 90000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 0,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 90000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 90000,
                        remainingFunding: 90000,
                    }),
                },
                maxVotes: 100000,
            }),
        },
        'it should receive partial funding from mixed pool': {
            proposal: new LeaderboardProposal({
                id: '1',
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                minimumRequestedFunding: 10000,
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
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
                        potentialRemainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        totalEffectiveVotes: 410000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
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
                        minimumRequestedFunding: 10000,
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
                        totalFunding: 8000,
                        relevantFunding: 0,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                        totalEffectiveVotes: 200000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 0,
                        totalEffectiveVotes: 410000
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

        service = module.get<EarmarkedProposalStrategy>(EarmarkedProposalStrategy);
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

            expect(result).toEqual(expected);
        },
    );
});
