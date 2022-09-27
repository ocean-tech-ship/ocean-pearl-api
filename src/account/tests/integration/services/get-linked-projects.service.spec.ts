import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { GetLinkedProjectsService } from '../../../services/get-linked-projects.service';

describe('GetLinkedProjectsService', () => {
    let module: TestingModule;
    let service: GetLinkedProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<GetLinkedProjectsService>(
            GetLinkedProjectsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
