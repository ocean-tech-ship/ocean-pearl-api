import { Container } from 'typescript-ioc';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { OceanUserInterface, OceanUserRepository } from '../../../src/database';
import { UserTitleEnum } from '../../../src/database/enums/user-title.enum';
import OceanUser from '../../../src/database/model/ocean-user.model';

beforeEach(async () => {
    dotenv.config();

    await mongoose.connect(process.env.TEST_MONGO_URL as string, {
        useNewUrlParser: true,
    });

    require('../../../src/database/index');
});

afterAll(async () => {
    await OceanUser.deleteOne({ id: '6060e915a8c5f54934190542' });
    await mongoose.connection.close();
});

describe('ocean-user.repository', () => {
    const repository: OceanUserRepository = Container.get(OceanUserRepository);
    let oceanUser: OceanUserInterface = <OceanUserInterface>{
        _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
        title: UserTitleEnum.Dr,
        firstname: 'John',
        lastname: 'Doe',
        age: 28,
        socialMedia: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
    };

    test('canary validates test infrastructure', () => {
        expect(true).toBe(true);
    });

    describe('Given I have a ocean user repository', () => {
        test('it should save a user', async () => {
            expect(await repository.create(oceanUser)).toEqual(
                new mongoose.Types.ObjectId('6060e915a8c5f54934190542')
            );
        });

        test('it should return a user', async () => {
            const dbOceanUser = await repository.getByID(oceanUser._id);

            expect({
                _id: dbOceanUser._id,
                title: dbOceanUser.title,
                firstname: dbOceanUser.firstname,
                lastname: dbOceanUser.lastname,
                age: dbOceanUser.age,
                socialMedia: dbOceanUser.socialMedia,
            }).toEqual({
                _id: new mongoose.Types.ObjectId('6060e915a8c5f54934190542'),
                title: UserTitleEnum.Dr,
                firstname: 'John',
                lastname: 'Doe',
                age: 28,
                socialMedia: new mongoose.Types.ObjectId(
                    '6060e915a8c5f54934190542'
                ),
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
            expect(await repository.delete(oceanUser._id)).toBeTruthy();
        });
    });
});
