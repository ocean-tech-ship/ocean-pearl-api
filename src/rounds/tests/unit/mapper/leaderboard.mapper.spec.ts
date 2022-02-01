import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { Round } from '../../../../database/schemas/round.schema';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { LeaderboardMapper } from '../../../mapper/leaderboard.mapper';
import { Leaderboard } from '../../../models/leaderboard.model';

const faker = require('faker');

describe('LeaderboardMapper', () => {
    let module: TestingModule;
    let service: LeaderboardMapper;

    const futureDate: Date = faker.date.future();
    const pastDate: Date = faker.date.past();

    const mapDataProvider = {
        'it should map for USD': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 200000,
                        fundingOcean: 0,
                    },
                },
                availableFundingUsd: 800000,
                availableFundingOcean: 0,
                votingEndDate: futureDate,
                votingStartDate: pastDate,
                submissionEndDate: pastDate,
            } as Round,
            expected: new Leaderboard({
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                amountProposals: 0,
                maxVotes: 0,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                paymentOption: PaymentOptionEnum.Usd,
                votingEndDate: futureDate,
                votingStartDate: pastDate,
                status: RoundStatusEnum.VotingInProgress,
                round: 10,
                overallFunding: 800000,
                overallRequestedFunding: 0,
                totalVotes: 0,
            }),
        },
        'it should map for OCEAN': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Ocean,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingOcean: 200000,
                        fundingUsd: 0,
                    },
                },
                availableFundingOcean: 800000,
                availableFundingUsd: 0,
                votingEndDate: futureDate,
                votingStartDate: pastDate,
                submissionEndDate: pastDate,
            } as Round,
            expected: new Leaderboard({
                amountProposals: 0,
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Ocean,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                status: RoundStatusEnum.VotingInProgress,
                votingEndDate: futureDate,
                votingStartDate: pastDate,
            }),
        },
        'it should map the correct status: proposal submission': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 200000,
                        fundingOcean: 0,
                    },
                },
                availableFundingUsd: 800000,
                availableFundingOcean: 0,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
                submissionEndDate: futureDate,
            } as Round,
            expected: new Leaderboard({
                amountProposals: 0,
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                status: RoundStatusEnum.ProposalSubmission,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
            }),
        },
        'it should map the correct status: pending': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 200000,
                        fundingOcean: 0,
                    },
                },
                availableFundingUsd: 800000,
                availableFundingOcean: 0,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
                submissionEndDate: pastDate,
            } as Round,
            expected: new Leaderboard({
                amountProposals: 0,
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                status: RoundStatusEnum.Pending,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
            }),
        },
        'it should map the correct status: voting in progress': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 200000,
                        fundingOcean: 0,
                    },
                },
                availableFundingUsd: 800000,
                availableFundingOcean: 0,
                votingEndDate: futureDate,
                votingStartDate: pastDate,
                submissionEndDate: pastDate,
            } as Round,
            expected: new Leaderboard({
                amountProposals: 0,
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                status: RoundStatusEnum.VotingInProgress,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
            }),
        },
        'it should map the correct status: voting finished': {
            round: {
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        fundingUsd: 200000,
                        fundingOcean: 0,
                    },
                },
                availableFundingUsd: 800000,
                availableFundingOcean: 0,
                votingEndDate: pastDate,
                votingStartDate: pastDate,
                submissionEndDate: pastDate,
            } as Round,
            expected: new Leaderboard({
                amountProposals: 0,
                fundedProposals: [],
                partiallyFundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 200000,
                        remainingFunding: 200000,
                        potentialRemainingFunding: 200000,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 600000,
                        remainingFunding: 600000,
                    },
                },
                status: RoundStatusEnum.VotingFinished,
                votingEndDate: futureDate,
                votingStartDate: futureDate,
            }),
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LeaderboardMapper>(LeaderboardMapper);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(mapDataProvider))('%s', (description, { round, expected }) => {
        (expected.votingEndDate = round.votingEndDate),
            (expected.votingStartDate = round.votingStartDate),
            expect(service.map(round)).toEqual(expected);
    });
});
