import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { FeaturedProjectsService } from '../../../services/featured-projects.service';

describe('ProjectsService', () => {
  let service: FeaturedProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<FeaturedProjectsService>(FeaturedProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
