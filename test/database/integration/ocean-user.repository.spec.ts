import { Container } from 'typescript-ioc';
import { OceanUserInterface, OceanUserRepository, SocialMediaInterface } from '../../../src/database';
import { UserTitleEnum } from '../../../src/database/enums/user-title.enum';
import OceanUser from '../../../src/database/model/ocean-user.model';
import { nanoid } from '../../../src/database/functions/nano-id.function';

import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

const OCEAN_USER_ID: string = nanoid();

beforeEach(async () => {
    dotenv.config();

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
        useNewUrlParser: true,
    });

    require('../../../src/database/index');
});

afterAll(async () => {
    await OceanUser.deleteOne({ id: OCEAN_USER_ID });
    await mongoose.connection.close();
});

describe('ocean-user.repository', () => {
    const repository: OceanUserRepository = Container.get(OceanUserRepository);
    let oceanUser: OceanUserInterface = <OceanUserInterface>{
        id: OCEAN_USER_ID,
        title: UserTitleEnum.Dr,
        firstname: 'John',
        lastname: 'Doe',
        age: 28,
        socialMedia: {} as SocialMediaInterface,
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a ocean user repository', () => {
        test('it should save a user', async () => {
            expect(await repository.create(oceanUser)).toEqual(OCEAN_USER_ID);
        });

        test('it should return a user', async () => {
            const dbOceanUser = await repository.getByID(oceanUser.id);

            expect({
                id: dbOceanUser.id,
                title: dbOceanUser.title,
                firstname: dbOceanUser.firstname,
                lastname: dbOceanUser.lastname,
                age: dbOceanUser.age,
                socialMedia: dbOceanUser.socialMedia,
            }).toEqual({
                id: OCEAN_USER_ID,
                title: UserTitleEnum.Dr,
                firstname: 'John',
                lastname: 'Doe',
                age: 28,
                socialMedia: null,
            });
        });

        test('it should return all users', async () => {
            expect((await repository.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a user', async () => {
            oceanUser.title = UserTitleEnum.Mr;

            expect(await repository.update(oceanUser)).toBeTruthy();
        });

        test('it should delete a user', async () => {
            expect(await repository.delete(oceanUser.id)).toBeTruthy();
        });
    });
});
