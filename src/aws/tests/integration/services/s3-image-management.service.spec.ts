import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { S3ImageManagementService } from '../../../s3/services/s3-image-management.service';

describe('S3ImageManagementService', () => {
    let module: TestingModule;
    let service: S3ImageManagementService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [S3ImageManagementService],
        }).compile();

        service = module.get<S3ImageManagementService>(
            S3ImageManagementService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
