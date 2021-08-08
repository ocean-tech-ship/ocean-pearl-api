import { Module } from '@nestjs/common';
import { DaoProposalsModule } from '../dao-proposals/dao-proposals.module';
import { DatabaseModule } from '../database/database.module';
import { ProjectsModule } from '../projects/projects.module';
import { MetricsController } from './metrics.controller';
import { CalculateMetricsService } from './services/calculate-metrics.service';

@Module({
    imports: [ProjectsModule, DaoProposalsModule, DatabaseModule],
    controllers: [MetricsController],
    providers: [CalculateMetricsService],
    exports: [CalculateMetricsService],
})
export class MetricsModule {}
