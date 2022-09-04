import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Wallet } from 'ethers';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { OriginEnum } from '../../../../database/enums/origin.enum';
import {
    formatAddress,
    formatAddresses
} from '../../../../utils/wallet/services/address-format.service';
import { ProjectMapper } from '../../../mapper/project.mapper';

const airtableData = {
    'Project Name': 'Test',
    'Grant Category': 'DAO',
    'One Liner': 'Test Project One Liner',
    'Wallet Address': Wallet.createRandom().address,
    'Payment Wallets': `${Wallet.createRandom().address}\n${Wallet.createRandom().address}\n${
        Wallet.createRandom().address
    }`,
    'Team Name (from Login Email)': [faker.company.companyName()],
    'Created Date': faker.date.past(),
};

describe('ProjectMapper', () => {
    let service: ProjectMapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProjectMapper],
        }).compile();

        service = module.get<ProjectMapper>(ProjectMapper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should map correctly', () => {
        expect(service.map(airtableData)).toEqual({
            accessAddresses: formatAddresses([airtableData['Wallet Address']]),
            author: formatAddress(airtableData['Wallet Address']),
            category: CategoryEnum.DAO,
            createdAt: airtableData['Created Date'],
            description: 'Test Project One Liner',
            oneLiner: 'Test Project One Liner',
            title: 'Test',
            associatedAddresses: formatAddresses([airtableData['Wallet Address']]),
            paymentAddresses: formatAddresses(airtableData['Payment Wallets'].split('\n')),
            teamName: airtableData['Team Name (from Login Email)'][0],
            daoProposals: [],
            images: [],
            members: [],
            origin: OriginEnum.OceanDao,
        });
    });

    it('should choose the correct team name', () => {
        delete airtableData['Team Name (from Login Email)'];

        expect(service.map(airtableData).teamName).toEqual(airtableData['Project Name']);
    });
});
