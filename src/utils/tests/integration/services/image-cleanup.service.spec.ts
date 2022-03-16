import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ImageCleanupService } from '../../../services/image-cleanup.service';

describe('ImageCleanupService', () => {
    let module: TestingModule;
    let service: ImageCleanupService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
            providers: [ImageCleanupService],
        }).compile();

        service = module.get<ImageCleanupService>(ImageCleanupService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
