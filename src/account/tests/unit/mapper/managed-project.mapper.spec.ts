import { Test, TestingModule } from '@nestjs/testing';
import { ManagedProjectMapper } from '../../../mapper/managed-project.mapper';

describe('ManagedProjectMapper', () => {
    let service: ManagedProjectMapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ManagedProjectMapper],
        }).compile();

        service = module.get<ManagedProjectMapper>(ManagedProjectMapper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
