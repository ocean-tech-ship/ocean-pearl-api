import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { FileExtensionsEnum } from '../../../../aws/s3/enums/file-extensions.enum';
import { DatabaseModule } from '../../../database.module';
import { nanoid } from '../../../functions/nano-id.function';
import { ImageRepository } from '../../../repositories/image.repository';
import { Image } from '../../../schemas/image.schema';

const IMAGE_ID: string = nanoid();
const IMAGE_MONGO_ID: Types.ObjectId = new Types.ObjectId();
const IMAGE_URL: string = faker.internet.url();

describe('ImageRepository', () => {
    const image: Image = {
        _id: IMAGE_MONGO_ID,
        id: IMAGE_ID,
        key: IMAGE_ID,
        fileExtension: FileExtensionsEnum.Svg,
        url: IMAGE_URL,
    } as Image;

    let module: TestingModule;
    let service: ImageRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<ImageRepository>(ImageRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: IMAGE_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a image repository', () => {
        test('it should save a image', async () => {
            expect(await service.create(image)).toEqual(IMAGE_MONGO_ID);
        });

        test('it should return a image', async () => {
            const dbImage = await service.getByID(image.id);

            expect({
                id: dbImage.id,
                key: dbImage.key,
                fileExtension: dbImage.fileExtension,
                url: dbImage.url,
            }).toEqual({
                id: IMAGE_ID,
                key: IMAGE_ID,
                fileExtension: FileExtensionsEnum.Svg,
                url: IMAGE_URL,
            });
        });

        test('it should return all images', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a image', async () => {
            image.url = faker.internet.url();

            expect(await service.update(image)).toBeTruthy();
        });

        test('it should delete a image', async () => {
            expect(await service.delete({ find: { id: image.id } })).toBeTruthy();
        });
    });
});
