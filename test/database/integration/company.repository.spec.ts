import { Container } from 'typescript-ioc';
import Company, {
    CompanyInterface,
} from '../../../src/database/model/company.model';
import { CompanyRepository } from '../../../src/database/repository/company.repository';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

beforeEach(async () => {
    dotenv.config();

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
        useNewUrlParser: true,
    });

    require('../../../src/database/index');
});

afterAll(async () => {
    await Company.deleteOne({id: '6060e915a8c5f54934190542'});
    await mongoose.connection.close();
});

describe('company.repository', () => {
    const repository: CompanyRepository = Container.get(CompanyRepository);
    let company: CompanyInterface = <CompanyInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        name: 'Test',
        email: 'Test.email@email.com',
        phoneNumber: '123456789',
        socialMedia: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a company repository', () => {
        test('it should save a company', async () => {
            expect(await repository.create(company)).toEqual(
                new mongoose.Types.ObjectId('6060e915a8c5f54934190542')
            );
        });

        test('it should return a company', async () => {
            const dbCompany = await repository.getByID(company._id);

            expect({
                _id: dbCompany._id,
                name: dbCompany.name,
                email: dbCompany.email,
                phoneNumber: dbCompany.phoneNumber,
                socialMedia: dbCompany.socialMedia,
            }).toEqual({
                _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
                name: 'Test',
                email: 'test.email@email.com',
                phoneNumber: '123456789',
                socialMedia: null,
            });
        });

        test('it should return all companies', async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a company', async () => {
            company.name = 'UpdateTest';

            expect(await repository.update(company)).toBeTruthy();
        });

        test('it should delete a company', async () => {
            expect(await repository.delete(company._id)).toBeTruthy();
        });
    });
});
