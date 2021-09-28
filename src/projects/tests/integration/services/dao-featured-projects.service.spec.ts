import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { DaoFeaturedProjectsService } from '../../../services/dao-featured-projects.service';

describe('DaoFeaturedProjectsService', () => {
    let module: TestingModule;
    let service: DaoFeaturedProjectsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, ProjectsModule, AppModule],
        }).compile();

        service = module.get<DaoFeaturedProjectsService>(
            DaoFeaturedProjectsService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
