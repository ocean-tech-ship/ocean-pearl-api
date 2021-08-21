import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { Project } from '../../../../database/schemas/project.schema';
import { AirtableModule } from '../../../airtable.module';
import { SingleMissmatchedProposalStrategy } from '../../../strategies/single-missmatched-proposal.strategy';

const faker = require('faker');

describe('SingleMissmatchedProposalStrategy', () => {
    let service: SingleMissmatchedProposalStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<SingleMissmatchedProposalStrategy>(
            SingleMissmatchedProposalStrategy,
        );
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

    it('should be not be able to handle', () => {
        expect(
            service.canHandle(
                {} as Project,
                { project: faker.datatype.hexaDecimal(10) } as DaoProposal,
            ),
        ).resolves.toBeFalsy();
    });
});
