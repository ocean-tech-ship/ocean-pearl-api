import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DaoProposalsModule } from '../../../../dao-proposals/dao-proposals.module';
import { MetricsModule } from '../../../../metrics/metrics.module';
import { ProjectsModule } from '../../../../projects/projects.module';
import { PagesController } from '../../../pages.controller';

describe('PagesController', () => {
  let controller: PagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule, DaoProposalsModule, AppModule, MetricsModule],
      controllers: [PagesController],
    }).compile();

    controller = module.get<PagesController>(PagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
