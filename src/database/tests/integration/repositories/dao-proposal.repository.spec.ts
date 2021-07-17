import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { DaoProposalStatusEnum } from '../../../enums/dao-proposal-status.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { DaoProposalRepository } from '../../../repositories/dao-proposal.repository';
import { DaoProposal } from '../../../schemas/dao-proposal.schema';

const DAO_PROPOSAL_ID: string = nanoid();
const DAO_PROPOSAL_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('DaoProposalRepository', () => {
    let daoProposal: DaoProposal = {
        _id: DAO_PROPOSAL_MONGO_ID,
        id: DAO_PROPOSAL_ID,
        fundingRound: new Types.ObjectId(),
        project: new Types.ObjectId(),
        kpiRoi: 'kpiRoi',
        oceanProtocolPortUrl: 'oceanProtocolPortLink.com',
        title: 'The Title of the Proposal',
        description: 'Here stands a description',
        walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
        category: CategoryEnum.BuildAndIntegrate,
        votes: 100000,
        counterVotes: 20,
        status: DaoProposalStatusEnum.Running,
        deliverables: [new Types.ObjectId()],
        kpiTargets: [new Types.ObjectId()],
        requestedGrantToken: 10000,
        grantedToken: 10000,
        fundamentalMetric: 'test',
        paymentWalletsAddresses: [],
        ipfsHash: '',
        snapshotBlock: 123456789,
        voteUrl: '',
        images: []
    } as DaoProposal;

    let service: DaoProposalRepository;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule, AppModule]
      }).compile();
  
      service = module.get<DaoProposalRepository>(DaoProposalRepository);
    });

    afterAll(async () => {
        await service.delete(DAO_PROPOSAL_ID);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('Given I have a daoProposal repository', () => {
        test('it should save a daoProposal', async () => {
            expect(await service.create(daoProposal)).toEqual(
                DAO_PROPOSAL_MONGO_ID
            );
        });

        test('it should return a daoProposal', async () => {
            const dbDoaProposal = await service.getByID(daoProposal.id);

            expect({
                id: dbDoaProposal.id,
                fundingRound: dbDoaProposal.fundingRound,
                project: dbDoaProposal.project,
                kpiRoi: dbDoaProposal.kpiRoi,
                oceanProtocolPortUrl: dbDoaProposal.oceanProtocolPortUrl,
                title: dbDoaProposal.title,
                description: dbDoaProposal.description,
                walletAddress: dbDoaProposal.walletAddress,
                category: dbDoaProposal.category,
            }).toEqual({
                id: DAO_PROPOSAL_ID,
                fundingRound: null,
                project: null,
                kpiRoi: 'kpiRoi',
                oceanProtocolPortUrl: 'oceanProtocolPortLink.com',
                title: 'The Title of the Proposal',
                description: 'Here stands a description',
                walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
                category: CategoryEnum.BuildAndIntegrate,
            });
        });

        test('it should return all daoProposals', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a daoProposal', async () => {
            daoProposal.status = DaoProposalStatusEnum.Funded;

            expect(await service.update(daoProposal)).toBeTruthy();
        });

        test('it should delete a daoProposal', async () => {
            expect(await service.delete(daoProposal.id)).toBeTruthy();
        });
    });
});
