import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetFilteredDaoProposalsService } from '../../../services/get-filtered-dao-proposals.service';

describe('GetFilteredDaoProposalsService', () => {
    let module: TestingModule;
    let service: GetFilteredDaoProposalsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetFilteredDaoProposalsService>(
            GetFilteredDaoProposalsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
