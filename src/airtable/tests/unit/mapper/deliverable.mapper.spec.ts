import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableMapper } from '../../../mapper/deliverable.mapper';

const faker = require('faker');

let airtableData = {
    'Grant Deliverables': 'Test Deliverable',
    'Proposal Standing': 'Completed',
};

describe('DeliverableMapper', () => {
    let service: DeliverableMapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeliverableMapper],
        }).compile();

        service = module.get<DeliverableMapper>(DeliverableMapper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should map correctly', () => {
        expect(service.map(airtableData)).toEqual({
            title: 'Deliverables',
            description: 'Test Deliverable',
            delivered: true,
        });
    });

    it('should map the correct delivered status', () => {
        airtableData['Proposal Standing'] = 'InProgress';

        expect(service.map(airtableData).delivered).toBeFalsy();
    });
});
