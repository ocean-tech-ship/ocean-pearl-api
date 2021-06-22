import { Container } from 'typescript-ioc';
import DaoProposal, {
    DaoProposalInterface,
} from '../../../src/database/model/dao-proposal.model';
import { DaoProposalRepository } from '../../../src/database/repository/dao-proposal.repository';
import { DaoProposalStatusEnum } from '../../../src/database/enums/dao-proposal-status.enum';
import { CategoryEnum } from '../../../src/database/enums/category.enum';
import { nanoid } from '../../../src/database/functions/nano-id.function';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

const DAO_PROPOSAL_ID: string = nanoid();

beforeEach(async () => {
    dotenv.config();

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
        useNewUrlParser: true,
    });

    require('../../../src/database/index');
});

afterAll(async () => {
    await DaoProposal.deleteOne({ id: DAO_PROPOSAL_ID });
    await mongoose.connection.close();
});

describe('doa-proposal.repository', () => {
    const repository: DaoProposalRepository = Container.get(
        DaoProposalRepository
    );
    let daoProposal: DaoProposalInterface = <DaoProposalInterface>{
        id: DAO_PROPOSAL_ID,
        startDate: new Date(),
        finishDate: new Date(),
        fundingRound: 2,
        project: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
        kpiRoi: 'kpiRoi',
        oceanProtocalPortUrl: 'oceanProtocalPortLink.com',
        title: 'The Title of the Proposal',
        description: 'Here stands a description',
        walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
        category: CategoryEnum.Defi,
        votes: 100000,
        counterVotes: 20,
        status: DaoProposalStatusEnum.FundingRoundActive,
        deliverables: [new mongoose.Types.ObjectId('6060e915a8c5f54934190543')],
        kpiTargets: [new mongoose.Types.ObjectId('6060e915a8c5f54934190544')],
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a daoProposal repository', () => {
        test('it should save a daoProposal', async () => {
            expect(await repository.create(daoProposal)).toEqual(
                DAO_PROPOSAL_ID
            );
        });

        test('it should return a daoProposal', async () => {
            const dbDoaProposal = await repository.getByID(daoProposal.id);

            expect({
                id: dbDoaProposal.id,
                startDate: dbDoaProposal.startDate,
                finishDate: dbDoaProposal.finishDate,
                fundingRound: dbDoaProposal.fundingRound,
                project: dbDoaProposal.project,
                kpiRoi: dbDoaProposal.kpiRoi,
                oceanProtocalPortUrl: dbDoaProposal.oceanProtocalPortUrl,
                title: dbDoaProposal.title,
                description: dbDoaProposal.description,
                walletAddress: dbDoaProposal.walletAddress,
                category: dbDoaProposal.category,
            }).toEqual({
                id: DAO_PROPOSAL_ID,
                startDate: daoProposal.startDate,
                finishDate: daoProposal.finishDate,
                fundingRound: 2,
                project: null,
                kpiRoi: 'kpiRoi',
                oceanProtocalPortUrl: 'oceanProtocalPortLink.com',
                title: 'The Title of the Proposal',
                description: 'Here stands a description',
                walletAddress: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
                category: CategoryEnum.Defi,
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
            expect(await repository.delete(daoProposal.id)).toBeTruthy();
        });
    });
});
