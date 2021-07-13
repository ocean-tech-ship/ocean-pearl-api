import { Test, TestingModule } from '@nestjs/testing';
import { SyncProposalsDataService } from '../../../services/sync-proposals-data.service';

describe('FetchAirtableDataService', () => {
    let service: SyncProposalsDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SyncProposalsDataService],
        }).compile();

        service = module.get<SyncProposalsDataService>(
            SyncProposalsDataService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
