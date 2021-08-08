import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { LatestProjectsService } from '../../../services/latest-projects.service';

describe('LatestProjectsService', () => {
  let service: LatestProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<LatestProjectsService>(LatestProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
