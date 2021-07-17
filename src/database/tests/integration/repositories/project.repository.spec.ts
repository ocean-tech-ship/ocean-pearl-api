import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { ProjectRepository } from '../../../repositories/project.repository';
import { Project } from '../../../schemas/project.schema';
import { SocialMedia } from '../../../schemas/social-media.schema';

const PROJECT_ID: string = nanoid();
const PROJECT_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('ProjectRepository', () => {
    let project: Project = <Project>{
        _id: PROJECT_MONGO_ID,
        id: PROJECT_ID,
        title: 'Best project ever',
        description: 'Still the best project ever.',
        socialMedia: {} as SocialMedia,
        category: CategoryEnum.CoreSoftware,
        logo: 'picture here pls',
        company: new Types.ObjectId(),
        teamName: 'TestTeam',
    };

    let service: ProjectRepository;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule, AppModule]
      }).compile();
  
      service = module.get<ProjectRepository>(ProjectRepository);
    });

    afterAll(async () => {
        await service.delete(PROJECT_ID);
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
                socialMedia: dbProject.socialMedia,
                category: dbProject.category,
                logo: dbProject.logo,
                company: dbProject.company,
            }).toEqual({
                id: PROJECT_ID,
                title: 'Best project ever',
                description: 'Still the best project ever.',
                socialMedia: {},
                logo: 'picture here pls',
                company: null,
                category: CategoryEnum.CoreSoftware,
            });
        });

        test('it should return all projects', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a project', async () => {
            project.title = 'UpdateTest';

            expect(await service.update(project)).toBeTruthy();
        });

        test('it should delete a project', async () => {
            expect(await service.delete(project.id)).toBeTruthy();
        });
    });
});
