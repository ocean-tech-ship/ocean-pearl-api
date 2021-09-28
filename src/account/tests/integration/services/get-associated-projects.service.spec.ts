import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { GetAssociatedProjectsService } from '../../../services/get-associated-projects.service';

describe('GetAssociatedProjectsService', () => {
    let module: TestingModule;
    let service: GetAssociatedProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<GetAssociatedProjectsService>(
            GetAssociatedProjectsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
