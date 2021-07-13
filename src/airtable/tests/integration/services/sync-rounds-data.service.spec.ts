import { Test, TestingModule } from '@nestjs/testing';
import { SyncRoundsDataService } from '../../../services/sync-rounds-data.service';

describe('ImportRoundsDataService', () => {
    let service: SyncRoundsDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SyncRoundsDataService],
        }).compile();

        service = module.get<SyncRoundsDataService>(SyncRoundsDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
