import { Injectable } from '@nestjs/common';
import { CategoryEnum } from '../../database/enums/category.enum';
import { Project } from '../../database/schemas/project.schema';
import { CategoryMap } from '../constants/category-map.constant';

@Injectable()
export class ProjectMapper {
    public map(airtableData: any): Project {
        return {
            title: airtableData['Project Name'].trim(),
            description: airtableData['One Liner'],
            category:
                CategoryMap[airtableData['Grant Category'].trim()] ??
                CategoryEnum.Other,
            associatedAddresses: [airtableData['Wallet Address']],
            paymentWalletsAddresses: airtableData['Payment Wallets']
                ? airtableData['Payment Wallets'].split('\n')
                : [],
            teamName: airtableData['Team Name (from Login Email)']
                ? airtableData['Team Name (from Login Email)']
                : airtableData['Project Name'].trim(),
            createdAt: new Date(airtableData['Created Date']),
            daoProposals: [],
        } as Project;
    }
}
