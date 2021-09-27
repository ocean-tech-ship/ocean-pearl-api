import { Test, TestingModule } from '@nestjs/testing';
import { ManagedProjectMapper } from '../../../mapper/managed-project.mapper';

describe('ManagedProjectMapper', () => {
    let module: TestingModule;
    let service: ManagedProjectMapper;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [ManagedProjectMapper],
        }).compile();

        service = module.get<ManagedProjectMapper>(ManagedProjectMapper);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
