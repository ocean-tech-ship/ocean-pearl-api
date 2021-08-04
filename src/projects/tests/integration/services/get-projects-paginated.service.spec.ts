import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsModule } from '../../../projects.module';
import { GetProjectsPaginatedService } from '../../../services/get-projects-paginated.service';

describe('GetProjectsPaginatedService', () => {
  let service: GetProjectsPaginatedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProjectsModule, AppModule]
    }).compile();

    service = module.get<GetProjectsPaginatedService>(GetProjectsPaginatedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
