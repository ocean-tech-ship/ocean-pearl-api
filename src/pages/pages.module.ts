import { Module } from '@nestjs/common';
import { DaoProposalsModule } from '../dao-proposals/dao-proposals.module';
import { MetricsModule } from '../metrics/metrics.module';
import { ProjectsModule } from '../projects/projects.module';
import { PagesController } from './pages.controller';

@Module({
  imports: [
    ProjectsModule,
    DaoProposalsModule,
    MetricsModule
  ],
  controllers: [PagesController]
})
export class PagesModule {}
