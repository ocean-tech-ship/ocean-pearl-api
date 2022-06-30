import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { AwsModule } from '../../../../aws/aws.module';
import { DatabaseModule } from '../../../../database/database.module';
import { UtilsModule } from '../../../../utils/utils.module';
import { ImageUploadService } from '../../../services/image-upload.service';

describe('ImageUploadService', () => {
    let module: TestingModule;
    let service: ImageUploadService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule, UtilsModule],
            providers: [ImageUploadService],
        }).compile();

        service = module.get<ImageUploadService>(ImageUploadService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
