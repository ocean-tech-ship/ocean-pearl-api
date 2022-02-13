import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { nanoid } from '../../../functions/nano-id.function';
import { CompanyRepository } from '../../../repositories/company.repository';
import { Company } from '../../../schemas/company.schema';
import { faker } from '@faker-js/faker';

const COMPANY_ID: string = nanoid();
const COMPANY_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('CompanyRepository', () => {
    const company: Company = <Company>{
        _id: COMPANY_MONGO_ID,
        id: COMPANY_ID,
        name: faker.company.companyName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        socialMedia: {},
        address: {},
        projects: [],
        jobs: [],
    };

    let module: TestingModule;
    let service: CompanyRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<CompanyRepository>(CompanyRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: COMPANY_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a company repository', () => {
        test('it should save a company', async () => {
            expect(await service.create(company)).toEqual(COMPANY_MONGO_ID);
        });

        test('it should return a company', async () => {
            const dbCompany = await service.getByID(company.id);

            expect({
                id: dbCompany.id,
                name: dbCompany.name,
                email: dbCompany.email,
                phoneNumber: dbCompany.phoneNumber,
                socialMedia: dbCompany.socialMedia,
                address: dbCompany.address,
                projects: dbCompany.projects,
                jobs: dbCompany.jobs,
            }).toEqual({
                id: COMPANY_ID,
                name: company.name,
                email: company.email.toLocaleLowerCase(),
                phoneNumber: company.phoneNumber,
                socialMedia: {},
                address: {},
                projects: [],
                jobs: [],
            });
        });

        test('it should return all companies', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a company', async () => {
            company.name = 'UpdateTest';

            expect(await service.update(company)).toBeTruthy();
        });

        test('it should delete a company', async () => {
            expect(await service.delete({ find: { id: company.id } })).toBeTruthy();
        });
    });
});
