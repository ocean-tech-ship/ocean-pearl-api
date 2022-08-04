import { Injectable } from '@nestjs/common';
import { CategoryEnum } from '../../database/enums/category.enum';
import { OriginEnum } from '../../database/enums/origin.enum';
import { CryptoAddress } from '../../database/schemas/crypto-address.schema';
import { Project } from '../../database/schemas/project.schema';
import { CategoryMap } from '../constants/category-map.constant';

@Injectable()
export class ProjectMapper {
    public map(airtableData: any): Project {
        return {
            title: airtableData['Project Name'].trim(),
            description: airtableData['One Liner'],
            oneLiner: airtableData['One Liner'],
            category:
                CategoryMap[airtableData['Grant Category'].trim()] ??
                CategoryEnum.Other,
            associatedAddresses: [new CryptoAddress({ address: airtableData['Wallet Address'].toLowerCase()})],
            accessAddresses: [new CryptoAddress({ address: airtableData['Wallet Address'].toLowerCase()})],
            paymentAddresses: airtableData['Payment Wallets']
                ? airtableData['Payment Wallets']
                      .split('\n')
                      .map((address) => new CryptoAddress({ address: address.toLowerCase()}))
                : [],
            teamName: airtableData['Team Name (from Login Email)']
                ? airtableData['Team Name (from Login Email)'][0]
                : airtableData['Project Name'].trim(),
            createdAt: new Date(airtableData['Created Date']),
            daoProposals: [],
            origin: OriginEnum.OceanDao,
        } as Project;
    }
}
