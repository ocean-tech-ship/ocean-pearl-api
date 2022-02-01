import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { GrantPool } from '../../../models/grant-pool.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { LegacyGeneralProposalStrategy } from '../../../strategies/legacy-general-proposal.strategy';

describe('LegacyGeneralProposalStrategy', () => {
    let module: TestingModule;
    let service: LegacyGeneralProposalStrategy;

    const canHandleDataProvider = {
        'should be able to handle': {
            proposal: new LeaderboardProposal(),
            leaderboard: new Leaderboard(),
            expected: true,
        },
        'should not be able to handle: earmarked proposal': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            leaderboard: new Leaderboard(),
            expected: false,
        },
    };

    const executeDataProvider = {
        'it should receive full funding': {
            proposal: new LeaderboardProposal({
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
                        remainingFunding: 20000,
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
                        remainingFunding: 20000,
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
        'it should receive partial funding': {
            proposal: new LeaderboardProposal({
                requestedFunding: 20000,
                receivedFunding: 8000,
                effectiveVotes: 200000,
                yesVotes: 210000,
                noVotes: 10000,
            }),
            leaderboard: new Leaderboard({
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: new GrantPool({
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    }),
                },
            }),
            expected: new Leaderboard({
                partiallyFundedProposals: [
                    new LeaderboardProposal({
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
                        totalFunding: 8000,
                        remainingFunding: 8000,
                    }),
                    [EarmarkTypeEnum.General]: new GrantPool({
                        type: EarmarkTypeEnum.General,
                        totalFunding: 8000,
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

        service = module.get<LegacyGeneralProposalStrategy>(LegacyGeneralProposalStrategy);
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
