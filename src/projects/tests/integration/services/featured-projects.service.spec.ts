import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { FeaturedProjectsService } from '../../../services/featured-projects.service';

describe('ProjectsService', () => {
    let module: TestingModule;
    let service: FeaturedProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, ProjectsModule, AppModule],
        }).compile();

        service = module.get<FeaturedProjectsService>(FeaturedProjectsService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
