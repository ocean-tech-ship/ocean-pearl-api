import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { GetFilteredProjectsService } from '../../../services/get-filtered-projects.service';

describe('GetFilteredProjectsService', () => {
  let service: GetFilteredProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<GetFilteredProjectsService>(GetFilteredProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
