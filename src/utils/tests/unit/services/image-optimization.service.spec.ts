import { Test, TestingModule } from '@nestjs/testing';
import { ImageOptimizationService } from '../../../services/image-optimization.service';

describe('ImageOptimizationService', () => {
    let module: TestingModule;
    let service: ImageOptimizationService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [ImageOptimizationService],
        }).compile();

        service = module.get<ImageOptimizationService>(ImageOptimizationService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
