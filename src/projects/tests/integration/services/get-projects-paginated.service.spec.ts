import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { GetProjectsPaginatedService } from '../../../services/get-projects-paginated.service';

describe('GetProjectsPaginatedService', () => {
    let module: TestingModule;
    let service: GetProjectsPaginatedService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, ProjectsModule, AppModule],
        }).compile();

        service = module.get<GetProjectsPaginatedService>(
            GetProjectsPaginatedService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
