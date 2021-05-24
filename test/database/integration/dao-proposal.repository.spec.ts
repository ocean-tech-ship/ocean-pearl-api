import { Container } from 'typescript-ioc';
import DaoProposal, {
    DaoProposalInterface,
} from '../../../src/database/model/dao-proposal.model';
import { DaoProposalRepository } from '../../../src/database/repository/dao-proposal.repository';

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
    await DaoProposal.deleteOne({ id: '6060e915a8c5f54934190542' });
    await mongoose.connection.close();
});

describe('doa-proposal.repository', () => {
    const repository: DaoProposalRepository = Container.get(
        DaoProposalRepository
    );
    let daoProposal: DaoProposalInterface = <DaoProposalInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        startDate: new Date(),
        finishDate: new Date(),
        fundingRound: 2,
        project: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
        kpiRoi: 'kpiRoi',
        oceanProtocalPortLink: 'oceanProtocalPortLink.com',
        title: 'The Title of the Proposal',
        description: 'Here stands a description',
        walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a daoProposal repository', () => {
        test('it should save a daoProposal', async () => {
            expect(await repository.create(daoProposal)).toEqual(
                new mongoose.Types.ObjectId('6060e915a8c5f54934190542')
            );
        });

        test('it should return a daoProposal', async () => {
            const dbDoaProposal = await repository.getByID(daoProposal._id);

            expect({
                _id: dbDoaProposal._id,
                startDate: dbDoaProposal.startDate,
                finishDate: dbDoaProposal.finishDate,
                fundingRound: dbDoaProposal.fundingRound,
                project: dbDoaProposal.project,
                kpiRoi: dbDoaProposal.kpiRoi,
                oceanProtocalPortLink: dbDoaProposal.oceanProtocalPortLink,
                title: dbDoaProposal.title,
                description: dbDoaProposal.description,
                walletAddress: dbDoaProposal.walletAddress,
            }).toEqual({
                _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
                startDate: daoProposal.startDate,
                finishDate: daoProposal.finishDate,
                fundingRound: 2,
                project: null,
                kpiRoi: 'kpiRoi',
                oceanProtocalPortLink: 'oceanProtocalPortLink.com',
                title: 'The Title of the Proposal',
                description: 'Here stands a description',
                walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
            });
        });

        test('it should return all daoProposals', async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a daoProposal', async () => {
            daoProposal.fundingRound = 4;

            expect(await repository.update(daoProposal)).toBeTruthy();
        });

        test('it should delete a daoProposal', async () => {
            expect(await repository.delete(daoProposal._id)).toBeTruthy();
        });
    });
});
