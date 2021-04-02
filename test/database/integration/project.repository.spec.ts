import {Container} from 'typescript-ioc';
import { ProjectRepository } from '../../../src/database/repository/project.repository';
import { Project, ProjectInterface } from '../../../src/database/model/project.model';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

describe('company.repository', () => {


    const repository: ProjectRepository = Container.get(ProjectRepository);
    let project: ProjectInterface = <ProjectInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        title: 'Best project ever',
        description: 'Still the best project ever.',
        website: 'nicewebsitelink.com',
        logo: 'picture here pls',
        company: new mongoose.Types.ObjectId('6060e915a8c5f54934190541'),
    }

  beforeEach(async () => {
    dotenv.config();

    await mongoose.connect('mongodb://127.0.0.1:27017/ocean-pearl' as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await Project.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a company object', () => {
        test('it should save the company',async () => {
            expect(await repository.create(project)).toEqual(true);
        });

        test('it should return the company', async () => {
            const dbProject = await repository.getByID(project._id)

            expect({
                _id: dbProject._id,
                title: dbProject.title,
                description: dbProject.description,
                website: dbProject.website,
                logo: dbProject.logo,
                company: dbProject.company,
            }).toEqual(project);
        });

        test('it should return all companies',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update the company',async () => {
            project.title = 'UpdateTest';

            expect(await repository.update(project)).toEqual(true);
        });

        test('it should delete the company',async () => {
            expect(await repository.delete(project._id)).toEqual(true);
        });
  });
});
