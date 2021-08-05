import { Controller, Get } from '@nestjs/common';
import { GetLatestDaoProposalsService } from '../dao-proposals/services/get-latest-dao-proposals.service';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { Project } from '../database/schemas/project.schema';
import { Metrics } from '../metrics/interfaces/metrics.interface';
import { CalculateMetricsService } from '../metrics/services/calculate-metrics.service';
import { LatestProjectsService } from '../projects/services/latest-projects.service';

@Controller('pages')
export class PagesController {
    public constructor(
        private getLatestProjectsService: LatestProjectsService,
        private getLatestDaoProposalsService: GetLatestDaoProposalsService,
        private calculateMetricsService: CalculateMetricsService,
    ) {}

    @Get('index')
    async getIndexInfo(): Promise<{
        latestProjects: Project[];
        daoProposals: DaoProposal[];
        metrics: Metrics;
    }> {
        try {
            const latestProjects = await this.getLatestProjectsService.execute();
            const daoProposals = await this.getLatestDaoProposalsService.execute();
            const metrics = await this.calculateMetricsService.execute();

            return {
                latestProjects: latestProjects,
                daoProposals: daoProposals,
                metrics: metrics,
            };
        } catch (error: any) {
            throw error;
        }
    }
}
