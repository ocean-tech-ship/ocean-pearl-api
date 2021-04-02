import {Container} from 'typescript-ioc';
import { Company, CompanyInterface } from '../../../src/database/model/company.model';
import { CompanyRepository } from '../../../src/database/repository/company.repository';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

describe('company.repository', () => {


    const repository: CompanyRepository = Container.get(CompanyRepository);
    let company: CompanyInterface = <CompanyInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        name: 'Test',
        email: 'Test.email@email.com',
        phoneNumber: '123456789',
        socialMedia: {
            twitter: 'test.twitter@link.com',
        },
    }

  beforeEach(async () => {
    dotenv.config();

    await mongoose.connect('mongodb://127.0.0.1:27017/ocean-pearl' as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await Company.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a company object', () => {
        test('it should save the company',async () => {
            expect(await repository.create(company)).toEqual(true);
        });

        test('it should return the company', async () => {
            const dbCompany = await repository.getByID(company._id)

            expect({
                _id: dbCompany._id,
                name: dbCompany.name,
                email: dbCompany.email,
                phoneNumber: dbCompany.phoneNumber,
                socialMedia: dbCompany.socialMedia,
            }).toEqual(company);
        });

        test('it should return all companies',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update the company',async () => {
            company.name = 'UpdateTest';

            expect(await repository.update(company)).toEqual(true);
        });

        test('it should delete the company',async () => {
            expect(await repository.delete(company._id)).toEqual(true);
        });
  });
});
