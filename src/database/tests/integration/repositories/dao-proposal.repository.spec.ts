import { Test, TestingModule } from '@nestjs/testing';
import { Wallet } from 'ethers';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { DaoProposalStatusEnum } from '../../../enums/dao-proposal-status.enum';
import { FundamentalMetricEnum } from '../../../enums/fundamental-metric.enum';
import { StandingEnum } from '../../../enums/standing.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { DaoProposalRepository } from '../../../repositories/dao-proposal.repository';
import { DaoProposal } from '../../../schemas/dao-proposal.schema';
import { Funding } from '../../../schemas/funding.schema';

const DAO_PROPOSAL_ID: string = nanoid();
const DAO_PROPOSAL_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('DaoProposalRepository', () => {
    const daoProposal: DaoProposal = new DaoProposal({
        _id: DAO_PROPOSAL_MONGO_ID,
        id: DAO_PROPOSAL_ID,
        fundingRound: new Types.ObjectId(),
        standing: StandingEnum.InProgress,
        project: new Types.ObjectId(),
        oceanProtocolPortUrl: 'oceanProtocolPortLink.com',
        title: 'The Title of the Proposal',
        description: 'Here stands a description',
        category: CategoryEnum.BuildAndIntegrate,
        author: Wallet.createRandom().address,
        yesVotes: 100000,
        noVotes: 20,
        status: DaoProposalStatusEnum.Running,
        deliverables: [new Types.ObjectId()],
        requestedFunding: new Funding({
            usd: 8400,
            ocean: 10000,
        }),
        receivedFunding: new Funding({
            usd: 8400,
            ocean: 10000,
        }),
        fundamentalMetric: FundamentalMetricEnum.MvpLaunch,
        ipfsHash: '',
        snapshotBlock: 123456789,
        voteUrl: '',
        images: [],
    });

    let module: TestingModule;
    let service: DaoProposalRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<DaoProposalRepository>(DaoProposalRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: DAO_PROPOSAL_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a daoProposal repository', () => {
        test('it should save a daoProposal', async () => {
            expect(await service.create(daoProposal)).toEqual(DAO_PROPOSAL_MONGO_ID);
        });

        test('it should return a daoProposal', async () => {
            const dbDoaProposal = await service.getByID(daoProposal.id);

            expect({
                id: dbDoaProposal.id,
                fundingRound: dbDoaProposal.fundingRound,
                project: dbDoaProposal.project,
                oceanProtocolPortUrl: dbDoaProposal.oceanProtocolPortUrl,
                title: dbDoaProposal.title,
                description: dbDoaProposal.description,
                category: dbDoaProposal.category,
            }).toEqual({
                id: DAO_PROPOSAL_ID,
                fundingRound: null,
                project: null,
                oceanProtocolPortUrl: 'oceanProtocolPortLink.com',
                title: 'The Title of the Proposal',
                description: 'Here stands a description',
                category: CategoryEnum.BuildAndIntegrate,
            });
        });

        test('it should return all daoProposals', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a daoProposal', async () => {
            daoProposal.status = DaoProposalStatusEnum.Funded;

            expect(await service.update(daoProposal)).toBeTruthy();
        });

        test('it should delete a daoProposal', async () => {
            expect(await service.delete({ find: { id: daoProposal.id } })).toBeTruthy();
        });
    });
});
