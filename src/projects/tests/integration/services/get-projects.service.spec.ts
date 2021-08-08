import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { GetProjectsService } from '../../../services/get-projects.service';

describe('GetProjectsService', () => {
  let service: GetProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<GetProjectsService>(GetProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
