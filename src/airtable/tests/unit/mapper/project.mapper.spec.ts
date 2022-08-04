import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { ProjectMapper } from '../../../mapper/project.mapper';
import { faker } from '@faker-js/faker';
import { CryptoAddress } from '../../../../database/schemas/crypto-address.schema';

const airtableData = {
    'Project Name': 'Test',
    'Grant Category': 'DAO',
    'One Liner': 'Test Project One Liner',
    'Wallet Address': faker.datatype.hexadecimal(42),
    'Payment Wallets':
        '0xddede3ad5Ad1B9554cCE67b1F5AccAcCbf2ea37Ec7\n0x5cD036ADE2aC359Facf197c7e3aa9CEE477f3B04a2\n0xc6db676ABB0CCb2cdE3e77cafF27DAed5D5e875b5F',
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
            accessAddresses: [
                new CryptoAddress({ address: airtableData['Wallet Address'].toLowerCase() }),
            ],
            category: CategoryEnum.DAO,
            createdAt: airtableData['Created Date'],
            description: 'Test Project One Liner',
            oneLiner: 'Test Project One Liner',
            title: 'Test',
            associatedAddresses: [
                new CryptoAddress({ address: airtableData['Wallet Address'].toLowerCase() }),
            ],
            paymentAddresses: [
                new CryptoAddress({
                    address: '0xddede3ad5Ad1B9554cCE67b1F5AccAcCbf2ea37Ec7'.toLowerCase(),
                }),
                new CryptoAddress({
                    address: '0x5cD036ADE2aC359Facf197c7e3aa9CEE477f3B04a2'.toLowerCase(),
                }),
                new CryptoAddress({
                    address: '0xc6db676ABB0CCb2cdE3e77cafF27DAed5D5e875b5F'.toLowerCase(),
                }),
            ],
            teamName: airtableData['Team Name (from Login Email)'][0],
            daoProposals: [],
        });
    });

    it('should choose the correct team name', () => {
        delete airtableData['Team Name (from Login Email)'];

        expect(service.map(airtableData).teamName).toEqual(airtableData['Project Name']);
    });
});
