import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetDaoProposalByIdService } from '../../../services/get-dao-proposal-by-id.service';

describe('GetDaoProposalByIdService', () => {
    let module: TestingModule;
    let service: GetDaoProposalByIdService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetDaoProposalByIdService>(
            GetDaoProposalByIdService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
