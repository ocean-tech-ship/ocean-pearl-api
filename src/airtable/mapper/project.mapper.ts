import { Injectable } from '@nestjs/common';
import { CategoryEnum } from '../../database/enums/category.enum';
import { OriginEnum } from '../../database/enums/origin.enum';
import { Project } from '../../database/schemas/project.schema';
import { CategoryMap } from '../constants/category-map.constant';
import { AddressFormatService } from '../../utils/wallet/services/address-format.service';

@Injectable()
export class ProjectMapper {
    public constructor(private addressFormatService: AddressFormatService) {}

    public map(airtableData: any): Project {
        const walletAddress = this.addressFormatService.execute(airtableData['Wallet Address']);

        return {
            title: airtableData['Project Name'].trim(),
            description: airtableData['One Liner'],
            oneLiner: airtableData['One Liner'],
            category: CategoryMap[airtableData['Grant Category'].trim()] ?? CategoryEnum.Other,
            author: walletAddress,
            associatedAddresses: [walletAddress],
            accessAddresses: [walletAddress],
            paymentAddresses: airtableData['Payment Wallets']
                ? airtableData['Payment Wallets']
                      .split('\n')
                      .map((address) => this.addressFormatService.execute(address))
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
