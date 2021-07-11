import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { DaoProposalStatusEnum } from '../../../enums/dao-proposal-status.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { DaoProposalRepository } from '../../../repositories/dao-proposal.repository';
import { DaoProposal } from '../../../schemas/dao-proposal.schema';
import { Project } from '../../../schemas/project.schema';

const DAO_PROPOSAL_ID: string = nanoid();

describe('DaoProposalRepository', () => {
    let daoProposal: DaoProposal = <DaoProposal>{
        id: DAO_PROPOSAL_ID,
        startDate: new Date(),
        finishDate: new Date(),
        fundingRound: 2,
        project: new Types.ObjectId(),
        kpiRoi: 'kpiRoi',
        oceanProtocolPortUrl: 'oceanProtocolPortLink.com',
        title: 'The Title of the Proposal',
        description: 'Here stands a description',
        walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
        category: CategoryEnum.BuildAndIntegrate,
        votes: 100000,
        counterVotes: 20,
        status: DaoProposalStatusEnum.FundingRoundActive,
        deliverables: [new Types.ObjectId()],
        kpiTargets: [new Types.ObjectId()],
        requestedGrantToken: 10000,
        requestedGrantUSD: 5000,
        grantAmountToken: 10000,
        grantAmountUSD: 5000,
        fundamentalMetric: 'test',
        paymentWalletsAddresses: [],
        ipfsHash: '',
        snapshotBlock: 123456789,
        voteUrl: '',
        images: []
    };

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
                DAO_PROPOSAL_ID
            );
        });

        test('it should return a daoProposal', async () => {
            const dbDoaProposal = await service.getByID(daoProposal.id);

            expect({
                id: dbDoaProposal.id,
                startDate: dbDoaProposal.startDate,
                finishDate: dbDoaProposal.finishDate,
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
                startDate: daoProposal.startDate,
                finishDate: daoProposal.finishDate,
                fundingRound: 2,
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
            daoProposal.fundingRound = 4;

            expect(await service.update(daoProposal)).toBeTruthy();
        });

        test('it should delete a daoProposal', async () => {
            expect(await service.delete(daoProposal.id)).toBeTruthy();
        });
    });
});
