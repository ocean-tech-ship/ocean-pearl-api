import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { ProposalsProvider } from '../../../provider/proposals.provider';

describe('ProposalsProvider', () => {
    let module: TestingModule;
    let service: ProposalsProvider;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AirtableModule, HttpModule, AppModule],
            providers: [ConfigService],
        }).compile();

        service = module.get<ProposalsProvider>(ProposalsProvider);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
