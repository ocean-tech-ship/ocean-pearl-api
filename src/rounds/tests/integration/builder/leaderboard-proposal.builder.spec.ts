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

describe('LeaderboardProposalBuilder', () => {
    let module: TestingModule;
    let service: LeaderboardProposalBuilder;
    let projectRepository: ProjectRepository;

    const PROPOSAL_ID = nanoid();

    const buildDataProvider = {
        'it should choose the correct payment option: Usd': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl',
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                completedProposals: 4,
                voteUrl: 'https://port.oceanprotocol.com/',
                logoUrl: 'urlToLogo.com',
            } as LeaderboardProposal,
        },
        'it should choose the correct payment option: Ocean': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl',
                requestedFunding: 2000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                completedProposals: 4,
                voteUrl: 'https://port.oceanprotocol.com/',
                logoUrl: 'urlToLogo.com',
            } as LeaderboardProposal,
        },
        'it should calculate effective votes correctly: <= round 8': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl',
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 100000,
                tags: [CategoryEnum.Outreach],
                completedProposals: 4,
                voteUrl: 'https://port.oceanprotocol.com/',
                logoUrl: 'urlToLogo.com',
            } as LeaderboardProposal,
        },
        'it should calculate effective votes correctly: > round 8': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl',
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach],
                completedProposals: 4,
                voteUrl: 'https://port.oceanprotocol.com/',
                logoUrl: 'urlToLogo.com',
            } as LeaderboardProposal,
        },
        'it should mark earmarked proposals': {
            proposal: {
                project: { _id: new Types.ObjectId() } as Project,
                id: PROPOSAL_ID,
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
            expected: {
                id: PROPOSAL_ID,
                title: 'Ocean Pearl',
                requestedFunding: 1000,
                receivedFunding: 0,
                yesVotes: 100000,
                noVotes: 10000,
                effectiveVotes: 90000,
                tags: [CategoryEnum.Outreach, 'earmark'],
                isEarmarked: true,
                completedProposals: 4,
                voteUrl: 'https://port.oceanprotocol.com/',
                logoUrl: 'urlToLogo.com',
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

        const mockResponse = {
            title: 'Ocean Pearl',
            logo: {
                url: 'urlToLogo.com',
            },
            daoProposals: [{}, {}, {}, {}],
        } as Project;
        jest.spyOn(projectRepository, 'findOneRaw').mockImplementation(
            async () => mockResponse,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.each(Object.entries(buildDataProvider))(
        '%s',
        (description, { proposal, round, expected }) => {
            expect(service.build(proposal, round)).resolves.toEqual(expected);
        },
    );
});
