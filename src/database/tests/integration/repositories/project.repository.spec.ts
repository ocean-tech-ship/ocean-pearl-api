import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { MediaHandlesEnum } from '../../../enums/media-handles.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { ProjectRepository } from '../../../repositories/project.repository';
import { CryptoAddress } from '../../../schemas/crypto-address.schema';
import { Project } from '../../../schemas/project.schema';

const PROJECT_ID: string = nanoid();
const PROJECT_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('ProjectRepository', () => {
    const project: Project = <Project>{
        _id: PROJECT_MONGO_ID,
        id: PROJECT_ID,
        title: 'Best project ever',
        description: 'Still the best project ever.',
        oneLiner: 'Best project as one liner',
        mediaHandles:
            new Map<MediaHandlesEnum, string>([
                [MediaHandlesEnum.Twitter, 'test.twitter.com'],
            ]),
        category: CategoryEnum.CoreSoftware,
        logo: new Types.ObjectId('123456789101112131415161'),
        associatedAddresses: [
            new CryptoAddress({
                address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
            }),
        ],
        paymentAddresses: [
            new CryptoAddress({
                address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F42',
            }),
            new CryptoAddress({
                address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
            }),
        ],
        teamName: 'TestTeam',
    };

    let module: TestingModule;
    let service: ProjectRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<ProjectRepository>(ProjectRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: PROJECT_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a project repository', () => {
        test('it should save a project', async () => {
            expect(await service.create(project)).toEqual(PROJECT_MONGO_ID);
        });

        test('it should return a project', async () => {
            const dbProject = await service.getByID(project.id);

            expect({
                id: dbProject.id,
                title: dbProject.title,
                description: dbProject.description,
                mediaHandles: dbProject.mediaHandles,
                category: dbProject.category,
                logo: dbProject.logo,
            }).toEqual({
                id: PROJECT_ID,
                title: 'Best project ever',
                description: 'Still the best project ever.',
                mediaHandles: {
                    twitter: 'test.twitter.com',
                },
                logo: null,
                category: CategoryEnum.CoreSoftware,
            });
        });

        test('it should return all projects', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a project', async () => {
            project.title = 'UpdateTest';

            expect(await service.update(project)).toBeTruthy();
        });

        test('it should delete a project', async () => {
            expect(await service.delete({ find: { id: project.id } })).toBeTruthy();
        });
    });
});
