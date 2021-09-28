import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetDaoProposalsByRoundService } from '../../../services/get-dao-proposals-by-round.service';

describe('GetDaoProposalsByRoundService', () => {
    let module: TestingModule;
    let service: GetDaoProposalsByRoundService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetDaoProposalsByRoundService>(
            GetDaoProposalsByRoundService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
