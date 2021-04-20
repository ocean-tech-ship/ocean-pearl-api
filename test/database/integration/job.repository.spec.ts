import { Container } from 'typescript-ioc';
import { JobRepository } from '../../../src/database/repository/job.repository';
import Job, { JobInterface } from '../../../src/database/model/job.model';
import { CountryEnum } from '../../../src/database/enums/country.enum';
import { TokenOptionEnum } from '../../../src/database/enums/token-option.enum';

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
    await Job.collection.drop();
    await mongoose.connection.close();
});

describe('job.repository', () => {
    const repository: JobRepository = Container.get(JobRepository);
    let job: JobInterface = <JobInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        title: 'Head of doing Stuff',
        description: 'Do some Stuff plz.',
        location: CountryEnum.Germany,
        tokenSalaryOption: TokenOptionEnum.And,
        token: 'Ocean',
        salaryFrom: 100000,
        salaryTo: 125000,
        startDate: new Date(),
        company: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a job repository', () => {
        test('it should save a job', async () => {
            expect(await repository.create(job)).toEqual(
                new mongoose.Types.ObjectId('6060e915a8c5f54934190542')
            );
        });

        test('it should return a job', async () => {
            const dbJob = await repository.getByID(job._id);

            expect({
                _id: dbJob._id,
                title: dbJob.title,
                description: dbJob.description,
                location: dbJob.location,
                tokenSalaryOption: dbJob.tokenSalaryOption,
                token: dbJob.token,
                salaryFrom: dbJob.salaryFrom,
                salaryTo: dbJob.salaryTo,
                startDate: dbJob.startDate,
                company: dbJob.company,
            }).toEqual({
                _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
                title: 'Head of doing Stuff',
                description: 'Do some Stuff plz.',
                location: CountryEnum.Germany,
                tokenSalaryOption: TokenOptionEnum.And,
                token: 'Ocean',
                salaryFrom: 100000,
                salaryTo: 125000,
                startDate: job.startDate,
                company: null,
            });
        });

        test('it should return all jobs', async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a job', async () => {
            job.title = 'UpdateTest';

            expect(await repository.update(job)).toBeTruthy();
        });

        test('it should delete a job', async () => {
            expect(await repository.delete(job._id)).toBeTruthy();
        });
    });
});
