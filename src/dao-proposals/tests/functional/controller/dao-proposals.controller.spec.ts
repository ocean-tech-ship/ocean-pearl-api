import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsController } from '../../../dao-proposals.controller';
import { DaoProposalsModule } from '../../../dao-proposals.module';

describe('DaoProposalsController', () => {
    let module: TestingModule;
    let controller: DaoProposalsController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DaoProposalsModule, DatabaseModule, AppModule],
        }).compile();

        controller = module.get<DaoProposalsController>(DaoProposalsController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
