import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { LegacyEarmarkedProposalStrategy } from '../../../strategies/legacy-earmarked-proposal.strategy';
import { LegacyGeneralProposalStrategy } from '../../../strategies/legacy-general-proposal.strategy';
import { LegacyLeaderboardStrategyCollection } from '../../../strategies/legacy-leaderboard-strategy.collection';

describe('LegacyLeaderboardStrategyCollection', () => {
    let module: TestingModule;
    let service: LegacyLeaderboardStrategyCollection;

    const findMatchingStrategyDataProvider = {
        'it should return the earmarked strategy': {
            proposal: new LeaderboardProposal({
                isEarmarked: true,
                earmarkType: EarmarkTypeEnum.NewEntrants,
                requestedFunding: 20000,
                effectiveVotes: 100000,
                yesVotes: 100000,
                noVotes: 0,
            }),
            expected: LegacyEarmarkedProposalStrategy,
        },
        'it should return the general strategy': {
            proposal: new LeaderboardProposal(),
            expected: LegacyGeneralProposalStrategy,
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LegacyLeaderboardStrategyCollection>(
            LegacyLeaderboardStrategyCollection,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(findMatchingStrategyDataProvider))(
        '%s',
        (description, { proposal, expected }) => {
            expect(service.findMatchingStrategy(proposal)).toBeInstanceOf(expected);
        },
    );
});
