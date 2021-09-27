import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { MetricsController } from '../../../metrics.controller';
import { MetricsModule } from '../../../metrics.module';

describe('MetricsController', () => {
    let module: TestingModule;
    let controller: MetricsController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [MetricsModule, AppModule, DatabaseModule],
            controllers: [MetricsController],
        }).compile();

        controller = module.get<MetricsController>(MetricsController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
