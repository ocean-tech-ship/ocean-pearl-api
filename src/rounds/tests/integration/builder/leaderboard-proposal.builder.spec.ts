import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { PaymentOptionEnum } from '../../../../database/enums/payment-option.enum';
import { nanoid } from '../../../../database/functions/nano-id.function';
import { ProjectRepository } from '../../../../database/repositories/project.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { Round } from '../../../../database/schemas/round.schema';
import { LeaderboardProposalBuilder } from '../../../builder/leaderboard-proposal.builder';
import { LeaderboardProposal } from '../../../models/leaderboard-proposal.model';
import { DaoProposalStatusEnum } from '../../../../database/enums/dao-proposal-status.enum';

describe('LeaderboardProposalBuilder', () => {
    let module: TestingModule;
    let service: LeaderboardProposalBuilder;
    let projectRepository: ProjectRepository;

    const PROPOSAL_ID = nanoid();
    const PROJECT_ID = nanoid();

    const buildDataProvider = {
        'it should choose the correct payment option: Usd': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 1000,
                requestedGrantToken: 2000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as DaoProposal,
            round: {
                round: 8,
                paymentOption: PaymentOptionEnum.Usd,
            } as Round,
            project: {
                id: PROJECT_ID,
                title: 'Ocean Pearl Project',
                logo: {
                    url: 'urlToLogo.com',
                },
                daoProposals: [
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                ],
            } as Project,
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                project: {
                    id: PROJECT_ID,
                    title: 'Ocean Pearl Project',
                    logoUrl: 'urlToLogo.com',
                    completedProposals: 4,
                },
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                voteUrl: 'https://port.oceanprotocol.com/',
            } as LeaderboardProposal,
        },
        'it should choose the correct payment option: Ocean': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 1000,
                requestedGrantToken: 2000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as DaoProposal,
            round: {
                round: 8,
                paymentOption: PaymentOptionEnum.Ocean,
            } as Round,
            project: {
                id: PROJECT_ID,
                title: 'Ocean Pearl Project',
                logo: {
                    url: 'urlToLogo.com',
                },
                daoProposals: [
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Rejected },
                    { status: DaoProposalStatusEnum.NotFunded },
                ],
            } as Project,
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                project: {
                    id: PROJECT_ID,
                    title: 'Ocean Pearl Project',
                    logoUrl: 'urlToLogo.com',
                    completedProposals: 2,
                },
                requestedFunding: 2000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                voteUrl: 'https://port.oceanprotocol.com/',
            } as LeaderboardProposal,
        },
        'it should calculate effective votes correctly: <= round 8': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 1000,
                requestedGrantToken: 2000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as DaoProposal,
            round: {
                round: 7,
                paymentOption: PaymentOptionEnum.Usd,
            } as Round,
            project: {
                id: PROJECT_ID,
                title: 'Ocean Pearl Project',
                logo: {
                    url: 'urlToLogo.com',
                },
                daoProposals: [
                    { status: DaoProposalStatusEnum.Running },
                    { status: DaoProposalStatusEnum.Rejected },
                    { status: DaoProposalStatusEnum.DownVoted },
                    { status: DaoProposalStatusEnum.Received },
                ],
            } as Project,
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                project: {
                    id: PROJECT_ID,
                    title: 'Ocean Pearl Project',
                    logoUrl: 'urlToLogo.com',
                    completedProposals: 0,
                },
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 100000,
                tags: [CategoryEnum.Outreach],
                voteUrl: 'https://port.oceanprotocol.com/',
            } as LeaderboardProposal,
        },
        'it should calculate effective votes correctly: > round 8': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 1000,
                requestedGrantToken: 2000,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as DaoProposal,
            round: {
                round: 8,
                paymentOption: PaymentOptionEnum.Usd,
            } as Round,
            project: {
                id: PROJECT_ID,
                title: 'Ocean Pearl Project',
                logo: {
                    url: 'urlToLogo.com',
                },
                daoProposals: [
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Running },
                ],
            } as Project,
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                project: {
                    id: PROJECT_ID,
                    title: 'Ocean Pearl Project',
                    logoUrl: 'urlToLogo.com',
                    completedProposals: 3,
                },
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                voteUrl: 'https://port.oceanprotocol.com/',
            } as LeaderboardProposal,
        },
        'it should mark earmarked proposals': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                votes: 100000,
                counterVotes: 10000,
                requestedGrantUsd: 1000,
                requestedGrantToken: 2000,
                earmark: CategoryEnum.NewEntrants,
                category: CategoryEnum.Outreach,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as DaoProposal,
            round: {
                round: 8,
                paymentOption: PaymentOptionEnum.Usd,
            } as Round,
            project: {
                id: PROJECT_ID,
                title: 'Ocean Pearl Project',
                logo: {
                    url: 'urlToLogo.com',
                },
                daoProposals: [
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Granted },
                    { status: DaoProposalStatusEnum.Funded },
                    { status: DaoProposalStatusEnum.Granted },
                ],
            } as Project,
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl Proposal',
                project: {
                    id: PROJECT_ID,
                    title: 'Ocean Pearl Project',
                    logoUrl: 'urlToLogo.com',
                    completedProposals: 5,
                },
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach, 'earmark'],
                isEarmarked: true,
                voteUrl: 'https://port.oceanprotocol.com/',
            } as LeaderboardProposal,
        },
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
        }).compile();

        service = module.get<LeaderboardProposalBuilder>(
            LeaderboardProposalBuilder,
        );
        projectRepository = module.get<ProjectRepository>(ProjectRepository);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(buildDataProvider))(
        '%s',
        async (description, { proposal, round, project, expected }) => {
            jest.spyOn(projectRepository, 'findOne').mockImplementation(
                async () => project,
            );

            return expect(service.build(proposal, round)).resolves.toEqual(
                expected,
            );
        },
    );
});
