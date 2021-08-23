import { Test, TestingModule } from '@nestjs/testing';
import { AirtableUrlBuilder } from '../../../builder/airtable-url.builder';

const BASE_URL = process.env.AIRTABLE_URL + 'test';
const SEARCH_QUERY_STRING = '?filterByFormula=';

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

    it('should return just the baseUrl', () => {
        expect(service.build('test')).toEqual(BASE_URL);
    });

    it('should return an url with a query and one param', () => {
        expect(service.build('test', { value1: 'value1' })).toEqual(
            BASE_URL + SEARCH_QUERY_STRING + '%7Bvalue1%7D%3Dvalue1',
        );
    });

    it('should return an url with a query and two param', () => {
        expect(
            service.build('test', { value1: 'value1', value2: 'value2' }),
        ).toEqual(
            BASE_URL +
                SEARCH_QUERY_STRING +
                '%7Bvalue1%7D%3Dvalue1%7Bvalue2%7D%3Dvalue2',
        );
    });
});
