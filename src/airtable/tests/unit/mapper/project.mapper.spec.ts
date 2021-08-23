import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { ProjectMapper } from '../../../mapper/project.mapper';

const faker = require('faker');

let airtableData = {
    'Project Name': 'Test',
    'Grant Category': 'DAO',
    'One Liner': 'Test Project One Liner',
    'Wallet Address': faker.datatype.hexaDecimal(64),
    'Payment Wallets':
        '0xddede3ad5Ad1B9554cCE67b1F5AccAcCbf2ea37Ec75ad6Ad2Fa0Cf3EC520320e\n0x5cD036ADE2aC359Facf197c7e3aa9CEE477f3B04a27b7e2CBF7dEA519Ceeac1E\n0xc6db676ABB0CCb2cdE3e77cafF27DAed5D5e875b5FbcEfE6F8402729b313E20A',
    'Team Name (from Login Email)': faker.company.companyName(),
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
            category: CategoryEnum.DAO,
            createdAt: airtableData['Created Date'],
            description: "Test Project One Liner",
            title: 'Test',
            associatedAddresses: [airtableData['Wallet Address']],
            paymentWalletsAddresses: [
                '0xddede3ad5Ad1B9554cCE67b1F5AccAcCbf2ea37Ec75ad6Ad2Fa0Cf3EC520320e',
                '0x5cD036ADE2aC359Facf197c7e3aa9CEE477f3B04a27b7e2CBF7dEA519Ceeac1E',
                '0xc6db676ABB0CCb2cdE3e77cafF27DAed5D5e875b5FbcEfE6F8402729b313E20A',
            ],
            teamName: airtableData['Team Name (from Login Email)'],
            daoProposals: [],
        });
    });

    it('should choose the correct team name', () => {
        delete airtableData['Team Name (from Login Email)'];

        expect(service.map(airtableData).teamName).toEqual(
            airtableData['Project Name'],
        );
    });
});
