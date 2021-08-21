import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalRepository } from '../../../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { MissmatchedProposalStrategy } from '../../../strategies/missmatched-proposal.strategy';

describe('MissmatchedProposalStrategy', () => {
    let service: MissmatchedProposalStrategy;
    let proposalRepository: DaoProposalRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<MissmatchedProposalStrategy>(
            MissmatchedProposalStrategy,
        );
        proposalRepository = module.get<DaoProposalRepository>(
            DaoProposalRepository,
        );

        const mockResponse = { airtableId: 'someId' } as DaoProposal;
        jest.spyOn(proposalRepository, 'findOneRaw').mockImplementation(
            async () => mockResponse,
        );
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

    it('should be not be able to handle', () => {
        expect(
            service.canHandle(
                { daoProposals: [new Types.ObjectId()] } as Project,
                { airtableId: 'someId' } as DaoProposal,
            ),
        ).resolves.toBeFalsy();
    });
});
