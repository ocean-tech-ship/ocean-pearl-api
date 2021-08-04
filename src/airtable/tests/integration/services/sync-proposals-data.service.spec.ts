import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { SyncProposalsDataService } from '../../../services/sync-proposals-data.service';

describe('SyncProposalsDataService', () => {
    let service: SyncProposalsDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule, HttpModule],
        }).compile();

        service = module.get<SyncProposalsDataService>(
            SyncProposalsDataService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
