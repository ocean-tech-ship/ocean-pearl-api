import { Test, TestingModule } from '@nestjs/testing';
import { GetFulltextProposalService } from '../../../services/get-fulltext-proposal.service';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { AppModule } from '../../../../app.module';

describe('GetFulltextProposalService', () => {
    let module: TestingModule;
    let service: GetFulltextProposalService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetFulltextProposalService>(GetFulltextProposalService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
