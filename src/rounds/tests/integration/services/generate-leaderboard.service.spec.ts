import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
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
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { GenerateLeaderboardService } from '../../../services/generate-leaderboard.service';
import { GetCurrentRoundService } from '../../../services/get-current-round.service';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmaked-proposal.strategy';
import { GeneralPropsoalStrategy } from '../../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../../strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

const faker = require('faker');

describe('GenerateLeaderboardService', () => {
    let module: TestingModule;
    let service: GenerateLeaderboardService;
    let roundRepository: RoundRepository;
    let daoProposalRepository: DaoProposalRepository;
    let projectRepository: ProjectRepository;

    const PROPOSAL_ID = nanoid();
    const PROJECT_ID = nanoid();

    const votingStartDate = faker.date.past();
    const votingEndDate = faker.date.future();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule],
            providers: [
                GenerateLeaderboardService,
                LeaderboardProposalBuilder,
                LeaderboardMapper,
                LeaderboardStrategyCollection,
                EarmarkedPropsoalStrategy,
                GeneralPropsoalStrategy,
                WontReceiveFundingStrategy,
                GetCurrentRoundService,
            ],
        }).compile();

        service = module.get<GenerateLeaderboardService>(
            GenerateLeaderboardService,
        );
        roundRepository = module.get<RoundRepository>(RoundRepository);
        daoProposalRepository = module.get<DaoProposalRepository>(
            DaoProposalRepository,
        );
        projectRepository = module.get<ProjectRepository>(ProjectRepository);

        const currentRoundMockResponse = {
            round: 10,
            paymentOption: PaymentOptionEnum.Usd,
            availableFundingUsd: 100000,
            earmarkedFundingUsd: 20000,
            votingEndDate: votingEndDate,
            votingStartDate: votingStartDate,
        } as Round;
        jest.spyOn(roundRepository, 'findOne').mockImplementation(
            async () => currentRoundMockResponse,
        );

        const proposalRepositoryMockResponse = [
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 200000,
                counterVotes: 10000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 20000,
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.DAO,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 10000,
                counterVotes: 100000,
                requestedGrantUsd: 40000,
                category: CategoryEnum.CoreSoftware,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 55000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 10000,
                counterVotes: 100000,
                requestedGrantUsd: 20000,
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.UnleashData,
                voteUrl: 'https://port.oceanprotocol.com/',
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
                { standing: StandingEnum.Completed },
                { standing: StandingEnum.Completed },
                { standing: StandingEnum.Completed },
                { standing: StandingEnum.Completed },
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

    it('it should generate a full leaderbaord', () => {
        return expect(service.execute()).resolves.toEqual({
            fundedProposals: [
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    requestedFunding: 50000,
                    receivedFunding: 50000,
                    yesVotes: 200000,
                    noVotes: 10000,
                    effectiveVotes: 190000,
                    tags: [CategoryEnum.Outreach],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    isEarmarked: true,
                    requestedFunding: 20000,
                    receivedFunding: 20000,
                    yesVotes: 100000,
                    noVotes: 10000,
                    effectiveVotes: 90000,
                    tags: [CategoryEnum.DAO, 'earmark'],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    requestedFunding: 50000,
                    receivedFunding: 0,
                    yesVotes: 100000,
                    noVotes: 10000,
                    effectiveVotes: 90000,
                    tags: [CategoryEnum.Outreach],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    requestedFunding: 50000,
                    receivedFunding: 0,
                    yesVotes: 100000,
                    noVotes: 55000,
                    effectiveVotes: 45000,
                    tags: [CategoryEnum.Outreach],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
            ],
            notFundedProposals: [
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    requestedFunding: 40000,
                    receivedFunding: 0,
                    yesVotes: 10000,
                    noVotes: 100000,
                    effectiveVotes: -90000,
                    neededVotes: 90001,
                    tags: [CategoryEnum.CoreSoftware],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl Proposal',
                    project: {
                        id: PROJECT_ID,
                        title: 'Ocean Pearl Project',
                        logoUrl: 'urlToLogo.com',
                        completedProposals: 4,
                    },
                    isEarmarked: true,
                    requestedFunding: 20000,
                    receivedFunding: 0,
                    yesVotes: 10000,
                    noVotes: 100000,
                    effectiveVotes: -90000,
                    neededVotes: 90001,
                    tags: [CategoryEnum.UnleashData, 'earmark'],
                    voteUrl: 'https://port.oceanprotocol.com/',
                } as LeaderboardProposal,
            ],
            amountProposals: 6,
            overallFunding: 100000,
            overallRequestedFunding: 230000,
            round: 10,
            totalVotes: 805000,
            remainingEarmarkFunding: 0,
            remainingGeneralFunding: 30000,
            paymentOption: PaymentOptionEnum.Usd,
            status: RoundStatusEnum.VotingInProgress,
            voteStartDate: votingStartDate,
            voteEndDate: votingEndDate,
            maxVotes: 200000,
        } as Leaderboard);
    });
});