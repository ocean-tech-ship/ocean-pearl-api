import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetDaoProposalsService } from '../../../services/get-dao-proposals.service';

describe('GetDaoProposalsService', () => {
  let service: GetDaoProposalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DaoProposalsModule, AppModule]
    }).compile();

    service = module.get<GetDaoProposalsService>(GetDaoProposalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
