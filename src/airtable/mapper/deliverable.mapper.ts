import { Injectable } from '@nestjs/common';
import { Deliverable } from '../../database/schemas/deliverable.schema';

@Injectable()
export class DeliverableMapper {
    public map(airtableData: any): Deliverable {
        return {
            title: 'Deliverables',
            description: airtableData['Grant Deliverables'],
            delivered: airtableData['Proposal Standing'] === 'Completed',
        } as Deliverable;
    }
}
