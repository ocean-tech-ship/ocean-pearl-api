import {Container} from 'typescript-ioc';
import { Address, AddressInterface } from '../../../src/database/model/address.model';
import { AddressRepository } from '../../../src/database/repository/address.repository';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

describe('company.repository', () => {


    const repository: AddressRepository = Container.get(AddressRepository);
    let address: AddressInterface = <AddressInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        street: 'Teststreet',
        streetNumber: '43c',
        city: 'TestCity',
        state: 'TestState',
        zipCode: '12345',
        country: 'Germany'
    }

  beforeEach(async () => {
    dotenv.config();

    await mongoose.connect('mongodb://127.0.0.1:27017/ocean-pearl' as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await Address.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a company object', () => {
        test('it should save the company',async () => {
            expect(await repository.create(address)).toEqual(true);
        });

        test('it should return the company', async () => {
            const dbAddress = await repository.getByID(address._id)

            expect({
                _id: dbAddress._id,
                street: dbAddress.street,
                streetNumber: dbAddress.streetNumber,
                city: dbAddress.city,
                state: dbAddress.state,
                zipCode: dbAddress.zipCode,
                country: dbAddress.country,
            }).toEqual(address);
        });

        test('it should return all companies',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update the company',async () => {
            address.city = 'UpdateTest';

            expect(await repository.update(address)).toEqual(true);
        });

        test('it should delete the company',async () => {
            expect(await repository.delete(address._id)).toEqual(true);
        });
  });
});
