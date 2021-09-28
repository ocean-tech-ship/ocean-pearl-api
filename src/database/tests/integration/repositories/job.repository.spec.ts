import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CountryEnum } from '../../../enums/country.enum';
import { TokenOptionEnum } from '../../../enums/token-option.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { JobRepository } from '../../../repositories/job.repository';
import { Job } from '../../../schemas/job.schema';

const JOB_ID: string = nanoid();
const JOB_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('JobRepository', () => {
    const job: Job = <Job>{
        _id: JOB_MONGO_ID,
        id: JOB_ID,
        title: 'Head of doing Stuff',
        description: 'Do some Stuff plz.',
        location: CountryEnum.Germany,
        tokenSalaryOption: TokenOptionEnum.And,
        token: 'Ocean',
        salaryFrom: 100000,
        salaryTo: 125000,
        startDate: new Date(),
        company: new Types.ObjectId('6060e915a8c5f54934190541'),
    };

    let module: TestingModule;
    let service: JobRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<JobRepository>(JobRepository);
    });

    afterAll(async () => {
        await service.delete(JOB_ID);
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a job repository', () => {
        test('it should save a job', async () => {
            expect(await service.create(job)).toEqual(JOB_MONGO_ID);
        });

        test('it should return a job', async () => {
            const dbJob = await service.getByID(job.id);

            expect({
                id: dbJob.id,
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
                id: JOB_ID,
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
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a job', async () => {
            job.title = 'UpdateTest';

            expect(await service.update(job)).toBeTruthy();
        });

        test('it should delete a job', async () => {
            expect(await service.delete(job.id)).toBeTruthy();
        });
    });
});
