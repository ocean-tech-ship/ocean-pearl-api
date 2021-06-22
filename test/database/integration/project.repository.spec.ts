import { Container } from 'typescript-ioc';
import { ProjectRepository } from '../../../src/database/repository/project.repository';
import Project, {
    ProjectInterface,
} from '../../../src/database/model/project.model';
import { nanoid } from '../../../src/database/functions/nano-id.function';
import { CategoryEnum } from '../../../src/database/enums/category.enum';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

const PROJECT_ID: string = nanoid();

beforeEach(async () => {
    dotenv.config();

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
        useNewUrlParser: true,
    });

    require('../../../src/database/index');
});

afterAll(async () => {
    await Project.deleteOne({ id: PROJECT_ID });
    await mongoose.connection.close();
});

describe('project.repository', () => {
    const repository: ProjectRepository = Container.get(ProjectRepository);
    let project: ProjectInterface = <ProjectInterface>{
        id: PROJECT_ID,
        title: 'Best project ever',
        description: 'Still the best project ever.',
        category: CategoryEnum.Marketplace,
        socialMedia: new mongoose.Types.ObjectId('6060e915a8c5f54934190540'),
        logo: 'picture here pls',
        company: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a project repository', () => {
        test('it should save a project', async () => {
            expect(await repository.create(project)).toEqual(PROJECT_ID);
        });

        test('it should return a project', async () => {
            const dbProject = await repository.getByID(project.id);

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
                socialMedia: null,
                logo: 'picture here pls',
                company: null,
                category: CategoryEnum.Marketplace,
            });
        });

        test('it should return all projects', async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a project', async () => {
            project.title = 'UpdateTest';

            expect(await repository.update(project)).toBeTruthy();
        });

        test('it should delete a project', async () => {
            expect(await repository.delete(project.id)).toBeTruthy();
        });
    });
});
