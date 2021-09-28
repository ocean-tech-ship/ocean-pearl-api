import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetLatestDaoProposalsService } from '../../../services/get-latest-dao-proposals.service';

describe('GetLatestDaoProposalsService', () => {
    let module: TestingModule;
    let service: GetLatestDaoProposalsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetLatestDaoProposalsService>(
            GetLatestDaoProposalsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
