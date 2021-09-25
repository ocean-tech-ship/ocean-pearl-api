import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { ProposalsProvider } from '../../../provider/proposals.provider';

describe('ProposalsProvider', () => {
    let service: ProposalsProvider;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AirtableModule, HttpModule, AppModule],
            providers: [ConfigService],
        }).compile();

        service = module.get<ProposalsProvider>(ProposalsProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
