import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { NewProposalStrategy } from '../../../strategies/new-proposal.strategy';

describe('NewProposalStrategy', () => {
    let module: TestingModule;
    let service: NewProposalStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<NewProposalStrategy>(NewProposalStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be able to handle', () => {
        expect(service.canHandle({} as Project, null)).resolves.toBeTruthy();
    });

    it('should not be able to handle', () => {
        expect(
            service.canHandle({} as Project, {} as DaoProposal),
        ).resolves.toBeFalsy();
    });
});
