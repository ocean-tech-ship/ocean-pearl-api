import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ImageUtilsModule } from '../../../../utils/image/image-utils.module';
import { CreatePostService } from '../../../services/create-post.service';

describe('CreatePostService', () => {
    let module: TestingModule;
    let service: CreatePostService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, ImageUtilsModule],
        }).compile();

        service = module.get<CreatePostService>(CreatePostService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
