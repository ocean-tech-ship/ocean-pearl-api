import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { ImageUtilsModule } from '../../../utils/image/image-utils.module';
import { ImageController } from '../../controllers/image.controller';
import { ImageUploadService } from '../../services/image-upload.service';

describe('ImageController', () => {
    let module: TestingModule;
    let controller: ImageController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule, ImageUtilsModule],
            controllers: [ImageController],
            providers: [
                ImageUploadService
            ],
        }).compile();

        controller = module.get<ImageController>(ImageController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
