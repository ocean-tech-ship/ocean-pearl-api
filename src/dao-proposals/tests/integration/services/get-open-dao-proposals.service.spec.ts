import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetOpenDaoProposalsService } from '../../../services/get-open-dao-proposals.service';

describe('GetOpenDaoProposalsService', () => {
  let service: GetOpenDaoProposalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DaoProposalsModule, AppModule]
    }).compile();

    service = module.get<GetOpenDaoProposalsService>(GetOpenDaoProposalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
