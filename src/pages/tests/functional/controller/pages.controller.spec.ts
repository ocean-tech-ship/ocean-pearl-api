import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DaoProposalsModule } from '../../../../dao-proposals/dao-proposals.module';
import { MetricsModule } from '../../../../metrics/metrics.module';
import { ProjectsModule } from '../../../../projects/projects.module';
import { PagesController } from '../../../pages.controller';

describe('PagesController', () => {
    let module: TestingModule;
    let controller: PagesController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ProjectsModule,
                DaoProposalsModule,
                AppModule,
                MetricsModule,
            ],
            controllers: [PagesController],
        }).compile();

        controller = module.get<PagesController>(PagesController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
