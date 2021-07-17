import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { SyncRoundsDataService } from '../../../services/sync-rounds-data.service';

describe('SyncRoundsDataService', () => {
    let service: SyncRoundsDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule, HttpModule],
        }).compile();

        service = module.get<SyncRoundsDataService>(SyncRoundsDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
