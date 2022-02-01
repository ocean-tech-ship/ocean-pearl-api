import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetDaoProposalsService } from '../../../services/get-dao-proposals.service';

describe('GetFilteredDaoProposalsService', () => {
    let module: TestingModule;
    let service: GetDaoProposalsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetDaoProposalsService>(
            GetDaoProposalsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
