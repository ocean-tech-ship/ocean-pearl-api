import { Test, TestingModule } from '@nestjs/testing';
import { PicturesService } from '../../../services/pictures.service';

describe('PicturesService', () => {
    let module: TestingModule;
    let service: PicturesService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [PicturesService],
        }).compile();

        service = module.get<PicturesService>(PicturesService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
