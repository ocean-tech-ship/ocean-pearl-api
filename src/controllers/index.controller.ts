import { GET, Path } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { DaoProposalInterface, ProjectInterface } from '../database';
import { GetDaoFeaturedProjectsCommand, GetFeaturedProjectsCommand, GetLatestDaoProposalsCommand, GetLatestProjectsComand, GetOpenDaoProposalsCommand } from '../services';
import { MetricsInterface } from '../services/metrics/interface/metrics.interface';
import { CalculateMetricsCommand } from '../services/metrics/command/calculate-metrics.command';

@Path('/index')
export class IndexController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    getFeaturedProjectsCommand: GetFeaturedProjectsCommand;
    @Inject
    getLatestProjectsCommand: GetLatestProjectsComand;
    @Inject
    getDaoFeaturedProjectsCommand: GetDaoFeaturedProjectsCommand;
    @Inject
    getLatestDaoProposalsCommand: GetLatestDaoProposalsCommand;
    @Inject
    calculateMetricsCommand: CalculateMetricsCommand;

    get logger() {
        return this._baseLogger.child('IndexController');
    }

    @Path('info')
    @GET
    async getIndexInfo(): Promise<{
        featuredProjects: ProjectInterface[],
        latestProjects: ProjectInterface[],
        daoFeaturedProjects: ProjectInterface[],
        daoProposals: DaoProposalInterface[],
        metrics: MetricsInterface
    }> {
        try {
            const featuredProjects = await this.getFeaturedProjectsCommand.execute();
            const latestProjects = await this.getLatestProjectsCommand.execute();
            const daoFeaturedProjects = await this.getDaoFeaturedProjectsCommand.execute();
            const daoProposals = await this.getLatestDaoProposalsCommand.execute();
            const metrics = await this.calculateMetricsCommand.execute();

            return {
                featuredProjects: featuredProjects,
                latestProjects: latestProjects,
                daoFeaturedProjects: daoFeaturedProjects,
                daoProposals: daoProposals,
                metrics: metrics
            };
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
