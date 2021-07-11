import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { UserTitleEnum } from '../../../enums/user-title.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { PearlUserRepository } from '../../../repositories/pearl-user.repository';
import { PearlUser } from '../../../schemas/pearl-user.schema';
import { SocialMedia } from '../../../schemas/social-media.schema';

const PEARL_USER_ID: string = nanoid();

describe('PearlUserRepository', () => {
    let oceanUser: PearlUser = <PearlUser>{
        id: PEARL_USER_ID,
        title: UserTitleEnum.Dr,
        firstname: 'John',
        lastname: 'Doe',
        age: 28,
        socialMedia: {} as SocialMedia,
    };

    let service: PearlUserRepository;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DatabaseModule, AppModule]
      }).compile();
  
      service = module.get<PearlUserRepository>(PearlUserRepository);
    });

    afterAll(async () => {
        await service.delete(PEARL_USER_ID);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('Given I have a ocean user repository', () => {
        test('it should save a user', async () => {
            expect(await service.create(oceanUser)).toEqual(PEARL_USER_ID);
        });

        test('it should return a user', async () => {
            const dbOceanUser = await service.getByID(oceanUser.id);

            expect({
                id: dbOceanUser.id,
                title: dbOceanUser.title,
                firstname: dbOceanUser.firstname,
                lastname: dbOceanUser.lastname,
                age: dbOceanUser.age,
                socialMedia: dbOceanUser.socialMedia,
            }).toEqual({
                id: PEARL_USER_ID,
                title: UserTitleEnum.Dr,
                firstname: 'John',
                lastname: 'Doe',
                age: 28,
                socialMedia: {},
            });
        });

        test('it should return all users', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(
                1
            );
        });

        test('it should update a user', async () => {
            oceanUser.title = UserTitleEnum.Mr;

            expect(await service.update(oceanUser)).toBeTruthy();
        });

        test('it should delete a user', async () => {
            expect(await service.delete(oceanUser.id)).toBeTruthy();
        });
    });
});
