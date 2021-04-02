import {Container} from 'typescript-ioc';
import { DaoProposal, DaoProposalInterface } from '../../../src/database/model/dao-proposal.model';
import { DaoProposalRepository } from '../../../src/database/repository/dao-proposal.repository';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

describe('company.repository', () => {


    const repository: DaoProposalRepository = Container.get(DaoProposalRepository);
    let daoProposal: DaoProposalInterface = <DaoProposalInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        startDate: new Date(),
        finishDate: new Date(),
        fundingRound: 2,
        project: new mongoose.Types.ObjectId('6060e915a8c5f54934190541')
    }

  beforeEach(async () => {
    dotenv.config();

    await mongoose.connect('mongodb://127.0.0.1:27017/ocean-pearl' as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await DaoProposal.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a company object', () => {
        test('it should save the company',async () => {
            expect(await repository.create(daoProposal)).toEqual(true);
        });

        test('it should return the company', async () => {
            const dbDoaProposal = await repository.getByID(daoProposal._id)

            expect({
                _id: dbDoaProposal._id,
                startDate: dbDoaProposal.startDate,
                finishDate: dbDoaProposal.finishDate,
                fundingRound: dbDoaProposal.fundingRound,
                project: dbDoaProposal.project,
            }).toEqual(daoProposal);
        });

        test('it should return all companies',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update the company',async () => {
            daoProposal.fundingRound = 4;

            expect(await repository.update(daoProposal)).toEqual(true);
        });

        test('it should delete the company',async () => {
            expect(await repository.delete(daoProposal._id)).toEqual(true);
        });
  });
});
