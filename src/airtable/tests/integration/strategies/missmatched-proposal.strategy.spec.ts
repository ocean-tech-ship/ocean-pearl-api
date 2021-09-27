import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DaoProposalRepository } from '../../../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { MissmatchedProposalStrategy } from '../../../strategies/missmatched-proposal.strategy';

describe('MissmatchedProposalStrategy', () => {
    let module: TestingModule;
    let service: MissmatchedProposalStrategy;
    let proposalRepository: DaoProposalRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, AirtableModule],
        }).compile();

        service = module.get<MissmatchedProposalStrategy>(
            MissmatchedProposalStrategy,
        );
        proposalRepository = module.get<DaoProposalRepository>(
            DaoProposalRepository,
        );
    });

    beforeEach(async () => {
        const mockResponse = { airtableId: 'someId' } as DaoProposal;
        jest.spyOn(proposalRepository, 'findOneRaw').mockImplementation(
            async () => mockResponse,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be able to handle', () => {
        expect(
            service.canHandle(
                { daoProposals: [new Types.ObjectId()] } as Project,
                { airtableId: 'someOtherId' } as DaoProposal,
            ),
        ).resolves.toBeTruthy();
    });

    it('should not be able to handle', () => {
        expect(
            service.canHandle(
                { daoProposals: [new Types.ObjectId()] } as Project,
                { airtableId: 'someId' } as DaoProposal,
            ),
        ).resolves.toBeFalsy();
    });
});
