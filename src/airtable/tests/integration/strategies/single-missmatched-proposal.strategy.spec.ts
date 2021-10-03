import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { SingleMissmatchedProposalStrategy } from '../../../strategies/single-missmatched-proposal.strategy';

const faker = require('faker');

describe('SingleMissmatchedProposalStrategy', () => {
    let module: TestingModule;
    let service: SingleMissmatchedProposalStrategy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<SingleMissmatchedProposalStrategy>(
            SingleMissmatchedProposalStrategy,
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
            service.canHandle(null, {
                project: faker.datatype.hexaDecimal(10),
            } as DaoProposal),
        ).resolves.toBeTruthy();
    });

    it('should not be able to handle', () => {
        expect(
            service.canHandle(
                {} as Project,
                { project: faker.datatype.hexaDecimal(10) } as DaoProposal,
            ),
        ).resolves.toBeFalsy();
    });
});
