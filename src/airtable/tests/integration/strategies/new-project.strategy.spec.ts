import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { NewProjectStrategy } from '../../../strategies/new-project.strategy';

describe('NewProjectStrategy', () => {
    let module: TestingModule;
    let service: NewProjectStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<NewProjectStrategy>(NewProjectStrategy);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be able to handle', () => {
        expect(service.canHandle(null, null)).resolves.toBeTruthy();
    });

    it('should not be able to handle', () => {
        expect(
            service.canHandle({} as Project, {} as DaoProposal),
        ).resolves.toBeFalsy();
    });
});
