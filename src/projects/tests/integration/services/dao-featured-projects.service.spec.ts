import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { DaoFeaturedProjectsService } from '../../../services/dao-featured-projects.service';

describe('DaoFeaturedProjectsService', () => {
  let service: DaoFeaturedProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<DaoFeaturedProjectsService>(DaoFeaturedProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
