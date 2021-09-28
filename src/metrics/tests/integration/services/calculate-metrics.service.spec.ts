import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DaoProposalsModule } from '../../../../dao-proposals/dao-proposals.module';
import { DatabaseModule } from '../../../../database/database.module';
import { RoundsModule } from '../../../../rounds/rounds.module';
import { CalculateMetricsService } from '../../../services/calculate-metrics.service';

describe('CalculateMetricsService', () => {
    let module: TestingModule;
    let service: CalculateMetricsService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                DaoProposalsModule,
                AppModule,
                DatabaseModule,
                RoundsModule,
            ],
            providers: [CalculateMetricsService],
        }).compile();

        service = module.get<CalculateMetricsService>(CalculateMetricsService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
