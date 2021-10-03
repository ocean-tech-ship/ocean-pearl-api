import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetOpenDaoProposalsService } from '../../../services/get-open-dao-proposals.service';

describe('GetOpenDaoProposalsService', () => {
    let module: TestingModule;
    let service: GetOpenDaoProposalsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetOpenDaoProposalsService>(
            GetOpenDaoProposalsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
