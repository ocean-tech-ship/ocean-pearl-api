import { Test, TestingModule } from '@nestjs/testing';
import { LinkedProjectMapper } from '../../../mapper/linked-project.mapper';

describe('LinkedProjectMapper', () => {
    let module: TestingModule;
    let service: LinkedProjectMapper;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [LinkedProjectMapper],
        }).compile();

        service = module.get<LinkedProjectMapper>(LinkedProjectMapper);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
