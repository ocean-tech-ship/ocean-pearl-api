import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { DaoProposalStatusEnum } from '../../../../database/enums/dao-proposal-status.enum';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { StandingEnum } from '../../../../database/enums/standing.enum';
import { nanoid } from '../../../../database/functions/nano-id.function';
import { DaoProposalRepository } from '../../../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../../../database/repositories/project.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Funding } from '../../../../database/schemas/funding.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { Round } from '../../../../database/schemas/round.schema';
import { Image } from '../../../../database/schemas/image.schema';
import { LeaderboardProposalBuilder } from '../../../builder/leaderboard-proposal.builder';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { LeaderboardMapper } from '../../../mapper/leaderboard.mapper';
import { LeaderboardProject } from '../../../models/leaderboard-project.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { CalculateNeededVotesService } from '../../../services/calculate-needed-votes.service';
import { GenerateLeaderboardService } from '../../../services/generate-leaderboard.service';
import { LeaderboardCacheService } from '../../../services/leaderboard-cache.service';
import { EarmarkedProposalStrategy } from '../../../strategies/earmarked-proposal.strategy';
import { GeneralProposalStrategy } from '../../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../../strategies/leaderboard-strategy.collection';
import { faker } from '@faker-js/faker';
import { RemainingFundingStrategyEnum } from '../../../../database/enums/remaining-funding-strategy.enum';

describe('GenerateLeaderboardService', () => {
    let module: TestingModule;
    let service: GenerateLeaderboardService;
    let daoProposalRepository: DaoProposalRepository;
    let projectRepository: ProjectRepository;

    const PROJECT_ID = nanoid();

    const votingStartDate = faker.date.past();
    const votingEndDate = faker.date.future();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule, CacheModule.register()],
            providers: [
                GenerateLeaderboardService,
                CalculateNeededVotesService,
                LeaderboardProposalBuilder,
                LeaderboardMapper,
                LeaderboardStrategyCollection,
                LeaderboardCacheService,
                EarmarkedProposalStrategy,
                GeneralProposalStrategy,
            ],
        }).compile();

        service = module.get<GenerateLeaderboardService>(GenerateLeaderboardService);
        daoProposalRepository = module.get<DaoProposalRepository>(DaoProposalRepository);
        projectRepository = module.get<ProjectRepository>(ProjectRepository);

        const proposalRepositoryMockResponse = [
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF1',
                title: 'Ocean Pearl Proposal 1',
                yesVotes: 200000,
                noVotes: 10000,
                requestedFunding: {
                    usd: 50000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF2',
                title: 'Ocean Pearl Proposal 2',
                yesVotes: 100000,
                noVotes: 10000,
                requestedFunding: {
                    usd: 20000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.DAO,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF3',
                title: 'Ocean Pearl Proposal 3',
                yesVotes: 10000,
                noVotes: 100000,
                requestedFunding: {
                    usd: 40000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                category: CategoryEnum.CoreSoftware,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF4',
                title: 'Ocean Pearl Proposal 4',
                yesVotes: 100000,
                noVotes: 10000,
                requestedFunding: {
                    usd: 50000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF5',
                title: 'Ocean Pearl Proposal 5',
                yesVotes: 100000,
                noVotes: 55000,
                requestedFunding: {
                    usd: 50000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF6',
                title: 'Ocean Pearl Proposal 6',
                yesVotes: 10000,
                noVotes: 100000,
                requestedFunding: {
                    usd: 20000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 0,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.UnleashData,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF7',
                title: 'Ocean Pearl Proposal 7',
                yesVotes: 100000,
                noVotes: 55000,
                requestedFunding: {
                    usd: 20000,
                    ocean: 0,
                },
                minimumRequestedFunding: {
                    usd: 10000,
                    ocean: 0,
                },
                receivedFunding: new Funding(),
                category: CategoryEnum.Outreach,
            },
        ] as DaoProposal[];
        jest.spyOn(daoProposalRepository, 'getAll').mockImplementation(
            async () => proposalRepositoryMockResponse,
        );

        const projectRepositoryMockResponse = {
            id: PROJECT_ID,
            title: 'Ocean Pearl Project',
            logo: {
                url: 'urlToLogo.com',
            },
            daoProposals: [
                {
                    status: DaoProposalStatusEnum.Granted,
                    standing: StandingEnum.Completed,
                },
                {
                    status: DaoProposalStatusEnum.Funded,
                    standing: StandingEnum.Completed,
                },
                {
                    status: DaoProposalStatusEnum.Granted,
                    standing: StandingEnum.Completed,
                },
                {
                    status: DaoProposalStatusEnum.Funded,
                    standing: StandingEnum.Completed,
                },
            ],
        } as Project;
        jest.spyOn(projectRepository, 'findOne').mockImplementation(
            async () => projectRepositoryMockResponse,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('it should generate a full leaderboard', () => {
        const currentRoundMock = {
            round: 10,
            paymentOption: PaymentOptionEnum.Usd,
            availableFunding: {
                usd: 100000, 
                ocean: 0, 
            },
            grantPools: {
                [EarmarkTypeEnum.NewEntrants]: {
                    type: EarmarkTypeEnum.NewEntrants,
                    fundingUsd: 20000,
                    fundingOcean: 20000,
                },
            },
            remainingFundingStrategy: RemainingFundingStrategyEnum.Recycle,
            votingEndDate: votingEndDate,
            votingStartDate: votingStartDate,
        } as Round;

        return expect(service.execute(currentRoundMock)).resolves.toEqual(
            new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF2',
                        title: 'Ocean Pearl Proposal 2',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.NewEntrants]: 20000,
                        },
                        yesVotes: 100000,
                        noVotes: 10000,
                        effectiveVotes: 90000,
                        tags: [CategoryEnum.DAO]
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF1',
                        title: 'Ocean Pearl Proposal 1',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        requestedFunding: 50000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 46769.23076923077,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 46769.23076923077,
                        },
                        yesVotes: 200000,
                        noVotes: 10000,
                        effectiveVotes: 190000,
                        tags: [CategoryEnum.Outreach],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF4',
                        title: 'Ocean Pearl Proposal 4',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        requestedFunding: 50000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 22153.84615384615,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 22153.84615384615,
                        },
                        yesVotes: 100000,
                        noVotes: 10000,
                        effectiveVotes: 90000,
                        tags: [CategoryEnum.Outreach],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF5',
                        title: 'Ocean Pearl Proposal 5',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 11076.923076923078,
                        },
                        requestedFunding: 50000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 11076.923076923078,
                        yesVotes: 100000,
                        noVotes: 55000,
                        effectiveVotes: 45000,
                        tags: [CategoryEnum.Outreach],
                    }),
                ],
                notFundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF7',
                        title: 'Ocean Pearl Proposal 7',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        minimumRequestedFunding: 10000,
                        requestedFunding: 20000,
                        receivedFunding: 0,
                        yesVotes: 100000,
                        noVotes: 55000,
                        effectiveVotes: 45000,
                        tags: [CategoryEnum.Outreach],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF3',
                        title: 'Ocean Pearl Proposal 3',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        requestedFunding: 40000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 0,
                        yesVotes: 10000,
                        noVotes: 100000,
                        effectiveVotes: -90000,
                        tags: [CategoryEnum.CoreSoftware],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF6',
                        title: 'Ocean Pearl Proposal 6',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logo: {
                                url: 'urlToLogo.com',
                            } as Image,
                            completedProposals: 4,
                        }),
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        minimumRequestedFunding: 0,
                        receivedFunding: 0,
                        yesVotes: 10000,
                        noVotes: 100000,
                        effectiveVotes: -90000,
                        tags: [CategoryEnum.UnleashData]}),
                ],
                amountProposals: 7,
                overallFunding: 100000,
                overallRequestedFunding: 250000,
                round: 10,
                totalVotes: 960000,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        totalEffectiveVotes: 90000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 0,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 80000,
                        totalEffectiveVotes: 460000,
                        relevantEffectiveVotes: 0,
                        relevantFunding: 0,
                        remainingFunding: 0,
                    },
                },
                paymentOption: PaymentOptionEnum.Usd,
                remainingFundingStrategy: RemainingFundingStrategyEnum.Recycle,
                status: RoundStatusEnum.VotingInProgress,
                votingStartDate: votingStartDate,
                votingEndDate: votingEndDate,
                maxVotes: 200000,
            }),
        );
    });
});
