import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { DaoProposalsController } from '../../../dao-proposals.controller';
import { DaoProposalsModule } from '../../../dao-proposals.module';

describe('DaoProposalsController', () => {
  let controller: DaoProposalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DaoProposalsModule, DatabaseModule, AppModule]
    }).compile();

    controller = module.get<DaoProposalsController>(DaoProposalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
