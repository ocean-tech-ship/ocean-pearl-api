import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { GetProjectsPaginatedService } from '../../../../projects/services/get-projects-paginated.service';
import { DaoProposalsModule } from '../../../dao-proposals.module';

describe('GetProjectsPaginatedService', () => {
  let service: GetProjectsPaginatedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DaoProposalsModule, AppModule]
    }).compile();

    service = module.get<GetProjectsPaginatedService>(GetProjectsPaginatedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
