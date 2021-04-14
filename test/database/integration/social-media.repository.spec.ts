import { Container } from 'typescript-ioc';
import { SocialMediaRepository } from 'src/database/repository/social-media.repository';
import { SocialMedia, SocialMediaInterface } from 'src/database/model/social-media.model';

import * as dotenv from 'dotenv'; 
import * as mongoose from 'mongoose';

describe('project.repository', () => {


    const repository: SocialMediaRepository = Container.get(SocialMediaRepository);
    let socialMedia: SocialMediaInterface = <SocialMediaInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        website: 'testWebsite.com',
        github: 'testGithub.com',
        twitter: 'testTwitter.com',   
    }

  beforeEach(async () => {
    dotenv.config()

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await SocialMedia.collection.drop();
    await mongoose.connection.close();
  })

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

    describe('Given I have a project repository', () => {
        test('it should save a project',async () => {
            expect(await repository.create(socialMedia)).toEqual(true);
        });

        test('it should return a project', async () => {
            const dbSocialMedia = await repository.getByID(socialMedia._id)

            expect({
                _id: dbSocialMedia._id,
                website: dbSocialMedia.website,
                github: dbSocialMedia.github,
                twitter: dbSocialMedia.twitter,
            }).toEqual(socialMedia);
        });

        test('it should return all projects',async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a project',async () => {
            socialMedia.website = 'UpdateTest';

            expect(await repository.update(socialMedia)).toEqual(true);
        });

        test('it should delete a project',async () => {
            expect(await repository.delete(socialMedia._id)).toEqual(true);
        });
  });
});
