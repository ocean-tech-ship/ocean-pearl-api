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
                votingEndDate: faker.date.future(),
                votingStartDate: faker.date.past(),
                submissionEndDate: faker.date.past(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.VotingInProgress,
            } as Leaderboard,
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
                votingEndDate: faker.date.future(),
                votingStartDate: faker.date.past(),
                submissionEndDate: faker.date.past(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Ocean,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.VotingInProgress,
            } as Leaderboard,
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
                votingEndDate: faker.date.future(),
                votingStartDate: faker.date.future(),
                submissionEndDate: faker.date.future(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.ProposalSubmission,
            } as Leaderboard,
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
                votingEndDate: faker.date.future(),
                votingStartDate: faker.date.future(),
                submissionEndDate: faker.date.past(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.Pending,
            } as Leaderboard,
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
                votingEndDate: faker.date.future(),
                votingStartDate: faker.date.past(),
                submissionEndDate: faker.date.past(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.VotingInProgress,
            } as Leaderboard,
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
                votingEndDate: faker.date.past(),
                votingStartDate: faker.date.past(),
                submissionEndDate: faker.date.past(),
            } as Round,
            expected: {
                amountProposals: 0,
                fundedProposals: [],
                notFundedProposals: [],
                overallFunding: 800000,
                overallRequestedFunding: 0,
                maxVotes: 0,
                totalVotes: 0,
                round: 10,
                paymentOption: PaymentOptionEnum.Usd,
                earmarks: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        remainingFunding: 200000,
                    },
                },
                remainingGeneralFunding: 600000,
                status: RoundStatusEnum.VotingFinished,
            } as Leaderboard,
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

    it.each(Object.entries(mapDataProvider))(
        '%s',
        (description, { round, expected }) => {
            expected.voteEndDate = round.votingEndDate,
            expected.voteStartDate = round.votingStartDate,

            expect(service.map(round)).toEqual(expected);
        },
    );
});
