import { Controller, Get } from '@nestjs/common';
import { GetLatestDaoProposalsService } from '../dao-proposals/services/get-latest-dao-proposals.service';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { Project } from '../database/schemas/project.schema';
import { Metrics } from '../metrics/interfaces/metrics.interface';
import { CalculateMetricsService } from '../metrics/services/calculate-metrics.service';
import { DaoFeaturedProjectsService } from '../projects/services/dao-featured-projects.service';
import { FeaturedProjectsService } from '../projects/services/featured-projects.service';
import { LatestProjectsService } from '../projects/services/latest-projects.service';

@Controller('pages')
export class PagesController {

    public constructor(
        private getFeaturedProjectsService: FeaturedProjectsService,
        private getLatestProjectsService: LatestProjectsService,
        private getDaoFeaturedProjectsService: DaoFeaturedProjectsService,
        private getLatestDaoProposalsService: GetLatestDaoProposalsService,
        private calculateMetricsService: CalculateMetricsService,
    ) {}

    @Get('index')
    async getIndexInfo(): Promise<{
        featuredProjects: Project[],
        latestProjects: Project[],
        daoFeaturedProjects: Project[],
        daoProposals: DaoProposal[],
        metrics: Metrics
    }> {
        try {
            const featuredProjects = await this.getFeaturedProjectsService.execute();
            const latestProjects = await this.getLatestProjectsService.execute();
            const daoFeaturedProjects = await this.getDaoFeaturedProjectsService.execute();
            const daoProposals = await this.getLatestDaoProposalsService.execute();
            const metrics = await this.calculateMetricsService.execute();

            return {
                featuredProjects: featuredProjects,
                latestProjects: latestProjects,
                daoFeaturedProjects: daoFeaturedProjects,
                daoProposals: daoProposals,
                metrics: metrics
            };
        } catch (error: any) {
            throw error;
        }
    }

}
