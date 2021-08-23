import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetFilteredDaoProposalsService } from '../../../services/get-filtered-dao-proposals.service';

describe('GetFilteredDaoProposalsService', () => {
  let service: GetFilteredDaoProposalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DaoProposalsModule, AppModule]
    }).compile();

    service = module.get<GetFilteredDaoProposalsService>(GetFilteredDaoProposalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
