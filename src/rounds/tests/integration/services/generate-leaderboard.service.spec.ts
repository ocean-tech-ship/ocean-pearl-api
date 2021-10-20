import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { nanoid } from '../../../../database/functions/nano-id.function';
import { DaoProposalRepository } from '../../../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../../../database/repositories/project.repository';
import { RoundRepository } from '../../../../database/repositories/round.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { Round } from '../../../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../../../builder/leaderboard-proposal.builder';
import { RoundStatusEnum } from '../../../enums/round-status.enum';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { Leaderboard } from '../../../models/leaderboard.model';
import { RoundsModule } from '../../../rounds.module';
import { GenerateLeaderboardService } from '../../../services/generate-leaderboard.service';
import { GetCurrentRoundService } from '../../../services/get-current-round.service';
import { EarmarkedPropsoalStrategy } from '../../../strategies/earmaked-proposal.strategy';
import { GeneralPropsoalStrategy } from '../../../strategies/general-proposal.strategy';
import { LeaderboardStrategyCollection } from '../../../strategies/leaderboard-strategy.collection';
import { WontReceiveFundingStrategy } from '../../../strategies/wont-receive-funding.strategy';

describe('GenerateLeaderboardService', () => {
    let module: TestingModule;
    let service: GenerateLeaderboardService;
    let roundRepository: RoundRepository;
    let daoProposalRepository: DaoProposalRepository;
    let projectRepository: ProjectRepository;

    const PROPOSAL_ID = nanoid();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RoundsModule, AppModule, DatabaseModule],
            providers: [
                GenerateLeaderboardService,
                LeaderboardProposalBuilder,
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
        roundRepository = module.get<RoundRepository>(
            RoundRepository,
        );
        daoProposalRepository = module.get<DaoProposalRepository>(
            DaoProposalRepository,
        );
        projectRepository = module.get<ProjectRepository>(ProjectRepository);

        const currentRoundMockResponse = {
            round: 10,
            paymentOption: PaymentOptionEnum.Usd,
            availableFundingUsd: 100000,
            earmarkedFundingUsd: 20000,
            votingEndDate: new Date('05.11.2021'),
        } as Round;
        jest.spyOn(roundRepository, 'findOne').mockImplementation(
            async () => currentRoundMockResponse,
        );

        const proposalRepositoryMockResponse = [
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                votes: 200000,
                counterVotes: 10000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
                votes: 10000,
                counterVotes: 100000,
                requestedGrantUsd: 40000,
                category: CategoryEnum.CoreSoftware,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                votes: 100000,
                counterVotes: 55000,
                requestedGrantUsd: 50000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            },
            {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            title: 'Ocean Pearl',
            logo: {
                url: 'urlToLogo.com',
            },
            daoProposals: [{}, {}, {}, {}],
        } as Project;
        jest.spyOn(projectRepository, 'findOneRaw').mockImplementation(
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
                    title: 'Ocean Pearl',
                    requestedFunding: 50000,
                    receivedFunding: 50000,
                    yesVotes: 200000,
                    noVotes: 10000,
                    effectiveVotes: 190000,
                    tags: [CategoryEnum.Outreach],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl',
                    isEarmarked: true,
                    requestedFunding: 20000,
                    receivedFunding: 20000,
                    yesVotes: 100000,
                    noVotes: 10000,
                    effectiveVotes: 90000,
                    tags: [CategoryEnum.DAO, 'earmark'],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl',
                    requestedFunding: 50000,
                    receivedFunding: 0,
                    yesVotes: 100000,
                    noVotes: 10000,
                    effectiveVotes: 90000,
                    tags: [CategoryEnum.Outreach],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl',
                    requestedFunding: 50000,
                    receivedFunding: 0,
                    yesVotes: 100000,
                    noVotes: 55000,
                    effectiveVotes: 45000,
                    tags: [CategoryEnum.Outreach],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
            ],
            notFundedProposals: [
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl',
                    requestedFunding: 40000,
                    receivedFunding: 0,
                    yesVotes: 10000,
                    noVotes: 100000,
                    effectiveVotes: -90000,
                    neededVotes: 90001,
                    tags: [CategoryEnum.CoreSoftware],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
                {
                    id: PROPOSAL_ID,
                    title: 'Ocean Pearl',
                    isEarmarked: true,
                    requestedFunding: 20000,
                    receivedFunding: 0,
                    yesVotes: 10000,
                    noVotes: 100000,
                    effectiveVotes: -90000,
                    neededVotes: 90001,
                    tags: [CategoryEnum.UnleashData, 'earmark'],
                    completedProposals: 4,
                    voteUrl: 'https://port.oceanprotocol.com/',
                    logoUrl: 'urlToLogo.com',
                } as LeaderboardProposal,
            ],
            remainingEarmarkFunding: 0,
            remainingGeneralFunding: 30000,
            paymentOption: PaymentOptionEnum.Usd,
            status: RoundStatusEnum.VotingFinished,
            voteEndDate: new Date('05.11.2021'),
            maxVotes: 200000,
        } as Leaderboard);
    });
});
