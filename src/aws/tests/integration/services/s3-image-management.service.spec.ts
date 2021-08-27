import { Test, TestingModule } from '@nestjs/testing';
import { S3ImageManagementService } from '../../../s3/services/s3-image-management.service';

describe('S3ImageManagementService', () => {
    let service: S3ImageManagementService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
        }).compile();

        service = module.get<S3ImageManagementService>(S3ImageManagementService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
