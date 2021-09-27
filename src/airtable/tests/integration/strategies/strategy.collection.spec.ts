import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { AirtableModule } from '../../../airtable.module';
import { StrategyCollection } from '../../../strategies/strategy.collection';

describe('StrategyCollection', () => {
    let module: TestingModule;
    let service: StrategyCollection;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AirtableModule],
        }).compile();

        service = module.get<StrategyCollection>(StrategyCollection);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
