import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DaoProposalsModule } from '../../../../dao-proposals/dao-proposals.module';
import { DatabaseModule } from '../../../../database/database.module';
import { CalculateMetricsService } from '../../../services/calculate-metrics.service';

describe('CalculateMetricsService', () => {
  let service: CalculateMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DaoProposalsModule, AppModule, DatabaseModule],
      providers: [CalculateMetricsService],
    }).compile();

    service = module.get<CalculateMetricsService>(CalculateMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
