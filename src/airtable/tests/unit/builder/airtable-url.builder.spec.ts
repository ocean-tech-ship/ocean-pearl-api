import { Test, TestingModule } from '@nestjs/testing';
import { AirtableUrlBuilder } from '../../../builder/airtable-url.builder';

describe('AirtableUrlBuilder', () => {
    let service: AirtableUrlBuilder;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AirtableUrlBuilder],
        }).compile();

        service = module.get<AirtableUrlBuilder>(AirtableUrlBuilder);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
