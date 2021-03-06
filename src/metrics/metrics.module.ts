import { Module } from '@nestjs/common';
import { DaoProposalsModule } from '../dao-proposals/dao-proposals.module';
import { DatabaseModule } from '../database/database.module';
import { ProjectsModule } from '../projects/projects.module';
import { MetricsController } from './metrics.controller';
import { CalculateMetricsService } from './services/calculate-metrics.service';
import { GetCurrentRoundService } from '../rounds/services/get-current-round.service';

@Module({
    imports: [ProjectsModule, DaoProposalsModule, DatabaseModule],
    controllers: [MetricsController],
    providers: [CalculateMetricsService, GetCurrentRoundService],
    exports: [CalculateMetricsService],
})
export class MetricsModule {}
