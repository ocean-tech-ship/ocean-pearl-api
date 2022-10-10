import { Injectable } from '@nestjs/common';
import { CategoryEnum } from '../../database/enums/category.enum';
import { OriginEnum } from '../../database/enums/origin.enum';
import { Project } from '../../database/schemas/project.schema';
import { CategoryMap } from '../constants/category-map.constant';

@Injectable()
export class ProjectMapper {
    public map(airtableData: any): Project | null {
        if (!airtableData['Project Name']) {
            return null;
        }

        return new Project({
            title: airtableData['Project Name'].trim(),
            description: airtableData['One Liner'],
            oneLiner: airtableData['One Liner'],
            category: CategoryMap[airtableData['Grant Category']?.trim()] ?? CategoryEnum.Other,
            author: airtableData['Wallet Address'],
            associatedAddresses: [airtableData['Wallet Address']],
            accessAddresses: [airtableData['Wallet Address']],
            paymentAddresses: airtableData['Payment Wallets']
                ? airtableData['Payment Wallets']
                      .split('\n')
                : [],
            teamName: airtableData['Team Name (from Login Email)']
                ? airtableData['Team Name (from Login Email)'][0]
                : airtableData['Project Name'].trim(),
            createdAt: new Date(airtableData['Created Date']),
            daoProposals: [],
            origin: OriginEnum.OceanDao,
        });
    }
}
