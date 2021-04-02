import {Container} from 'typescript-ioc';
import { JobRepository } from '../../../src/database/repository/job.repository';
import { Job, JobInterface } from '../../../src/database/model/job.model';

import * as mongoose from 'mongoose';

describe('company.repository', () => {


    const repository: JobRepository = Container.get(JobRepository);
    let job: JobInterface = <JobInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        title: 'Head of doing Stuff',
        description: 'Do some Stuff plz.',
        location: 'HomeOffice',
        salaryFrom: 100000,
        salaryTo: 125000,
        startDate: new Date(),
        company: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
    }

  beforeEach(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/ocean-pearl' as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await Job.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a company object', () => {
        test('it should save the company',async () => {
            expect(await repository.create(job)).toEqual(true);
        });

        test('it should return the company', async () => {
            const dbJob = await repository.getByID(job._id)

            expect({
                _id: dbJob._id,
                title: dbJob.title,
                description: dbJob.description,
                location: dbJob.location,
                salaryFrom: dbJob.salaryFrom,
                salaryTo: dbJob.salaryTo,
                startDate: dbJob.startDate,
                company: dbJob.company,
            }).toEqual(job);
        });

        test('it should return all companies',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update the company',async () => {
            job.title = 'UpdateTest';

            expect(await repository.update(job)).toEqual(true);
        });

        test('it should delete the company',async () => {
            expect(await repository.delete(job._id)).toEqual(true);
        });
  });
});
