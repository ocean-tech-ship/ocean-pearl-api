import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmaked-proposal.strategy';

describe('EarmarkedPropsoalStrategy', () => {
    let module: TestingModule;
    let service: EarmarkedPropsoalStrategy;

    const canHandleDataProvider = [
        {
            description: 'should be able to handle',
            proposal: {
                isEarmarked: true,
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFundingUsd: 10000,
                remainingGeneralFundingUsd: 10000,
            } as Leaderboard,
            expected: true,
        },
        {
            description: 'should not be able to handle: not earmarked',
            proposal: {
                isEarmarked: false,
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFundingUsd: 10000,
                remainingGeneralFundingUsd: 10000,
            } as Leaderboard,
            expected: false,
        },
        {
            description:
                'should not be able to handle: negative effective votes',
            proposal: {
                isEarmarked: true,
                effectiveVotes: -1000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFundingUsd: 10000,
                remainingGeneralFundingUsd: 10000,
            } as Leaderboard,
            expected: false,
        },
        {
            description:
                'should not be able to handle: no overall funding left',
            proposal: {
                isEarmarked: true,
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFundingUsd: 0,
                remainingGeneralFundingUsd: 0,
            } as Leaderboard,
            expected: false,
        },
    ];

    const executeDataProvider = [
        {
            description: 'should be able to handle',
            proposal: {
                isEarmarked: true,
                effectiveVotes: 100000,
            } as LeaderboardProposal,
            leaderboard: {
                remainingEarmarkFundingUsd: 10000,
                remainingGeneralFundingUsd: 10000,
            } as Leaderboard,
            expected: true,
        },
    ]

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

    it.each(canHandleDataProvider)(
        '$description',
        ({ description, proposal, leaderboard, expected }) => {
            expect(
                service.canHandle(proposal, leaderboard),
            ).resolves.toEqual(expected);
        },
    );

    it.each(executeDataProvider)(
        '$description',
        ({ description, proposal, leaderboard, expected }) => {
            expect(
                service.canHandle(proposal, leaderboard),
            ).resolves.toEqual(expected);
        },
    );
});
