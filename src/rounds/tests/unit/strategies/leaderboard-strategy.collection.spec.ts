import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmaked-proposal.strategy';
import { GeneralPropsoalStrategy } from '../../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../../strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('LeaderboardStrategyCollection', () => {
    let module: TestingModule;
    let service: LeaderboardStrategyCollection;

    const findMatchingStrategyDataProvider = {
        'it should return the earmarked strategy: remaining earmarked funding': {
            proposal: {
                isEarmarked: true,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 20000,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: EarmarkedPropsoalStrategy,
        },
        'it should return the earmarked strategy: remaining general funding': {
            proposal: {
                isEarmarked: true,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 20000,
            } as Leaderboard,
            expected: EarmarkedPropsoalStrategy,
        },
        'it should return the general strategy': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 20000,
            } as Leaderboard,
            expected: GeneralPropsoalStrategy,
        },
        'it should return the wont receive funding strategy: negative effective votes': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: -10000,
                yesVotes: 0,
                noVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 20000,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: WontReceiveFundingStrategy,
        },
        'it should return the wont receive funding strategy: earmarked with no funding': {
            proposal: {
                isEarmarked: true,
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 0,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: WontReceiveFundingStrategy,
        },
        'it should return the wont receive funding strategy: general with no funding': {
            proposal: {
                requestedFunding: 20000,
                effectiveVotes: 10000,
                yesVotes: 100000,
                noVotes: 0,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFunding: 20000,
                remainingGeneralFunding: 0,
            } as Leaderboard,
            expected: WontReceiveFundingStrategy,
        },
    }

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LeaderboardStrategyCollection>(LeaderboardStrategyCollection);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(findMatchingStrategyDataProvider))(
        '%s',
        (description, { proposal, leaderboard, expected }) => {
            expect(service.findMatchingStrategy(proposal, leaderboard)).toBeInstanceOf(expected);
        },
    );
});
