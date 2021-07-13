import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsModule } from '../../../dao-proposals.module';
import { GetDaoProposalsByRoundService } from '../../../services/get-dao-proposals-by-round.service';

describe('GetDaoProposalsByRoundService', () => {
  let service: GetDaoProposalsByRoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DaoProposalsModule, AppModule]
    }).compile();

    service = module.get<GetDaoProposalsByRoundService>(GetDaoProposalsByRoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
