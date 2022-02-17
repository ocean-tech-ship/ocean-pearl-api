import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { DaoProposalStatusEnum } from '../../../../database/enums/dao-proposal-status.enum';
import { EarmarkTypeEnum } from '../../../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../../../database/enums/remaining-funding-strategy.enum';
import { StandingEnum } from '../../../../database/enums/standing.enum';
import { nanoid } from '../../../../database/functions/nano-id.function';
import { DaoProposalRepository } from '../../../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../../../database/repositories/project.repository';
import { RoundRepository } from '../../../../database/repositories/round.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { Round } from '../../../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../../../builder/leaderboard-proposal.builder';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { LeaderboardMapper } from '../../../mapper/leaderboard.mapper';
import { LeaderboardProject } from '../../../models/leaderboard-project.model';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { GenerateLegacyLeaderboardService } from '../../../services/generate-legacy-leaderboard.service';
import { LeaderboardCacheService } from '../../../services/leaderboard-cache.service';
import { LegacyEarmarkedProposalStrategy } from '../../../strategies/legacy-earmarked-proposal.strategy';
import { LegacyGeneralProposalStrategy } from '../../../strategies/legacy-general-proposal.strategy';
import { LegacyLeaderboardStrategyCollection } from '../../../strategies/legacy-leaderboard-strategy.collection';
import { faker } from '@faker-js/faker';

describe('GenerateLegacyLeaderboardService', () => {
    let module: TestingModule;
    let service: GenerateLegacyLeaderboardService;
    let roundRepository: RoundRepository;
    let daoProposalRepository: DaoProposalRepository;
    let projectRepository: ProjectRepository;

    const PROJECT_ID = nanoid();

    const votingStartDate = faker.date.past();
    const votingEndDate = faker.date.future();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule, CacheModule.register()],
            providers: [
                LeaderboardProposalBuilder,
                LeaderboardMapper,
                LegacyLeaderboardStrategyCollection,
                LeaderboardCacheService,
                LegacyEarmarkedProposalStrategy,
                LegacyGeneralProposalStrategy,
            ],
        }).compile();

        service = module.get<GenerateLegacyLeaderboardService>(GenerateLegacyLeaderboardService);
        roundRepository = module.get<RoundRepository>(RoundRepository);
        daoProposalRepository = module.get<DaoProposalRepository>(DaoProposalRepository);
        projectRepository = module.get<ProjectRepository>(ProjectRepository);

        const currentRoundMockResponse = {
            round: 10,
            paymentOption: PaymentOptionEnum.Usd,
            availableFundingUsd: 100000,
            earmarks: {
                [EarmarkTypeEnum.NewEntrants]: {
                    type: EarmarkTypeEnum.NewEntrants,
                    fundingUsd: 20000,
                    fundingOcean: 20000,
                },
            },
            votingEndDate: votingEndDate,
            votingStartDate: votingStartDate,
            remainingFundingStrategy: RemainingFundingStrategyEnum.Burn,
        } as Round;
        jest.spyOn(roundRepository, 'findOneRaw').mockImplementation(
            async () => currentRoundMockResponse,
        );

        const proposalRepositoryMockResponse = [
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF1',
                title: 'Ocean Pearl Proposal 1',
                votes: 200000,
                counterVotes: 10000,
                requestedGrantUsd: 50000,
                grantedUsd: 50000,
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF2',
                title: 'Ocean Pearl Proposal 2',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 20000,
                grantedUsd: 20000,
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.DAO,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF3',
                title: 'Ocean Pearl Proposal 3',
                votes: 10000,
                counterVotes: 100000,
                requestedGrantUsd: 40000,
                category: CategoryEnum.CoreSoftware,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF4',
                title: 'Ocean Pearl Proposal 4',
                votes: 100000,
                counterVotes: 10000,
                grantedUsd: 30000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF5',
                title: 'Ocean Pearl Proposal 5',
                votes: 100000,
                counterVotes: 55000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: 'D5C50B1aF6',
                title: 'Ocean Pearl Proposal 6',
                votes: 10000,
                counterVotes: 100000,
                requestedGrantUsd: 20000,
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.UnleashData,
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
        return expect(service.execute()).resolves.toEqual(
            new Leaderboard({
                fundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF1',
                        title: 'Ocean Pearl Proposal 1',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        requestedFunding: 50000,
                        receivedFunding: 50000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 50000,
                        },
                        yesVotes: 200000,
                        noVotes: 10000,
                        effectiveVotes: 190000,
                        tags: [CategoryEnum.Outreach],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF2',
                        title: 'Ocean Pearl Proposal 2',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        receivedFunding: 20000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.NewEntrants]: 20000,
                        },
                        yesVotes: 100000,
                        noVotes: 10000,
                        effectiveVotes: 90000,
                        tags: [CategoryEnum.DAO, 'earmark'],
                    }),
                ],
                partiallyFundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF4',
                        title: 'Ocean Pearl Proposal 4',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        requestedFunding: 50000,
                        receivedFunding: 30000,
                        grantPoolShare: {
                            [EarmarkTypeEnum.General]: 30000,
                        },
                        yesVotes: 100000,
                        noVotes: 10000,
                        effectiveVotes: 90000,
                        tags: [CategoryEnum.Outreach],
                    }),
                ],
                notFundedProposals: [
                    new LeaderboardProposal({
                        id: 'D5C50B1aF5',
                        title: 'Ocean Pearl Proposal 5',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        requestedFunding: 50000,
                        receivedFunding: 0,
                        yesVotes: 100000,
                        noVotes: 55000,
                        effectiveVotes: 45000,
                        tags: [CategoryEnum.Outreach],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF6',
                        title: 'Ocean Pearl Proposal 6',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        isEarmarked: true,
                        earmarkType: EarmarkTypeEnum.NewEntrants,
                        requestedFunding: 20000,
                        receivedFunding: 0,
                        yesVotes: 10000,
                        noVotes: 100000,
                        effectiveVotes: -90000,
                        tags: [CategoryEnum.UnleashData, 'earmark'],
                    }),
                    new LeaderboardProposal({
                        id: 'D5C50B1aF3',
                        title: 'Ocean Pearl Proposal 3',
                        project: new LeaderboardProject({
                            id: PROJECT_ID,
                            title: 'Ocean Pearl Project',
                            logoUrl: 'urlToLogo.com',
                            completedProposals: 4,
                        }),
                        requestedFunding: 40000,
                        receivedFunding: 0,
                        yesVotes: 10000,
                        noVotes: 100000,
                        effectiveVotes: -90000,
                        tags: [CategoryEnum.CoreSoftware],
                    }),
                ],
                amountProposals: 6,
                overallFunding: 100000,
                overallRequestedFunding: 230000,
                round: 10,
                totalVotes: 805000,
                grantPools: {
                    [EarmarkTypeEnum.NewEntrants]: {
                        type: EarmarkTypeEnum.NewEntrants,
                        totalFunding: 20000,
                        remainingFunding: 0,
                        potentialRemainingFunding: 0,
                    },
                    [EarmarkTypeEnum.General]: {
                        type: EarmarkTypeEnum.General,
                        totalFunding: 80000,
                        remainingFunding: 0,
                    },
                },
                remainingFundingStrategy: RemainingFundingStrategyEnum.Burn,
                paymentOption: PaymentOptionEnum.Usd,
                status: RoundStatusEnum.VotingInProgress,
                votingStartDate: votingStartDate,
                votingEndDate: votingEndDate,
                maxVotes: 200000,
            }),
        );
    });
});
