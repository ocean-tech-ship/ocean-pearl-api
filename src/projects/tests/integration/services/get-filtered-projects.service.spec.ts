import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { GetFilteredProjectsService } from '../../../services/get-filtered-projects.service';

describe('GetFilteredProjectsService', () => {
    let module: TestingModule;
    let service: GetFilteredProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, ProjectsModule, AppModule],
        }).compile();

        service = module.get<GetFilteredProjectsService>(
            GetFilteredProjectsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
