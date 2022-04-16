import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { GeneralProposalStrategy } from '../../../strategies/general-proposal.strategy';

describe('GeneralProposalStrategy', () => {
    let module: TestingModule;
    let service: GeneralProposalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: new LeaderboardProposal({
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            expected: true,
        },
        'should not be able to handle: earmarked': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                effectiveVotes: 1000,
                yesVotes: 1000,
                noVotes: 0,
            }),
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding': {
            proposal: new LeaderboardProposal({
                requestedFunding: 20000,
                minimumRequestedFunding: 10000,
                effectiveVotes: 200000,
                yesVotes: 300000,
                noVotes: 90000,
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
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 400000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 100000,
                        remainingFunding: 100000,
                    }),
                },
            }),
            expected: new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        minimumRequestedFunding: 10000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 20000,
                        },
                        effectiveVotes: 200000,
                        yesVotes: 300000,
                        noVotes: 90000,
                    }),
                ],
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 20000,
                        remainingFunding: 20000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 100000,
                        totalEffectiveVotes: 400000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 80000,
                        remainingFunding: 80000,
                    }),
                },
                maxVotes: 300000,
            }),
        },
        'it should receive partial funding': {
            proposal: new LeaderboardProposal({
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
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
                    }),
                },
            }),
            expected: new Leaderboard({
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        requestedFunding: 20000,
                        minimumRequestedFunding: 10000,
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
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 0,
                        remainingFunding: 0,
                    }),
                },
                maxVotes: 210000,
            }),
        },
        'it should receive percentual funding': {
            proposal: new LeaderboardProposal({
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
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
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
                        requestedFunding: 20000,
                        minimumRequestedFunding: 10000,
                        receivedFunding: 10000,
                        grantPoolShare: {
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
                        totalFunding: 8000,
                        totalEffectiveVotes: 200000,
                        relevantEffectiveVotes: 200000,
                        relevantFunding: 8000,
                        remainingFunding: 8000,
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
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<GeneralProposalStrategy>(GeneralProposalStrategy);
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
