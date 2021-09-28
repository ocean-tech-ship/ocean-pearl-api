import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { LatestProjectsService } from '../../../services/latest-projects.service';

describe('LatestProjectsService', () => {
    let module: TestingModule;
    let service: LatestProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, ProjectsModule, AppModule],
        }).compile();

        service = module.get<LatestProjectsService>(LatestProjectsService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
