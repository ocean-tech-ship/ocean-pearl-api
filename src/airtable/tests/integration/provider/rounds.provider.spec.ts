import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { RoundsProvider } from '../../../provider/rounds.provider';

describe('RoundsProvider', () => {
    let module: TestingModule;
    let service: RoundsProvider;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, HttpModule, AirtableModule, AppModule],
            providers: [ConfigService],
        }).compile();

        service = module.get<RoundsProvider>(RoundsProvider);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
