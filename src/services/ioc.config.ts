import { ContainerConfiguration, Scope } from 'typescript-ioc';
import { GetDaoProposalsCommandApi } from './dao-proposal/api/get-dao-proposals-command.api';
import { GetDaoProposalByIdCommandApi } from './dao-proposal/api/get-doa-proposals-by-id-command.api';
import { GetOpenDaoProposalsCommandApi } from './dao-proposal/api/get-open-dao-proposals-comand.api';
import { GetDaoProposalsCommand } from './dao-proposal/command/get-dao-proposals.command';
import { GetDaoProposalByIdCommand } from './dao-proposal/command/get-doa-proposal-by-id.command';
import { GetOpenDaoProposalsCommand } from './dao-proposal/command/get-open-doa-proposals.command';
import { CalculateMetricsCommandApi } from './metrics/api/calculate-metrics-command.api';
import { CalculateMetricsCommand } from './metrics/command/calculate-metrics.command';
import { GetDaoFeaturedProjectsCommandApi } from './project/api/get-dao-featured-projects-comand.api';
import { GetFeaturedProjectsCommandApi } from './project/api/get-featured-projects-command.api';
import { GetLatestProjectsComandApi } from './project/api/get-latest-projects-command.api';
import { GetProjectByIdCommandApi } from './project/api/get-project-by-id-command.api';
import { GetProjectsCommandApi } from './project/api/get-projects-command.api';
import { GetProjectsPaginatedCommandApi } from './project/api/get-projects-paginated-command.api';
import { GetDaoFeaturedProjectsCommand } from './project/command/get-dao-featured-projects.command';
import { GetFeaturedProjectsCommand } from './project/command/get-featured-projects.command';
import { GetLatestProjectsComand } from './project/command/get-latest-projects.command';
import { GetProjectByIdCommand } from './project/command/get-project-by-id.command';
import { GetProjectsPaginatedCommand } from './project/command/get-projects-paginated.command';
import { GetProjectsCommand } from './project/command/get-projects.command';

const config: ContainerConfiguration[] = [
    // Projects
    {
        bind: GetProjectsCommandApi,
        to: GetProjectsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetProjectsPaginatedCommandApi,
        to: GetProjectsPaginatedCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetFeaturedProjectsCommandApi,
        to: GetFeaturedProjectsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetProjectByIdCommandApi,
        to: GetProjectByIdCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetLatestProjectsComandApi,
        to: GetLatestProjectsComand,
        scope: Scope.Singleton,
    },
    {
        bind: GetDaoFeaturedProjectsCommandApi,
        to: GetDaoFeaturedProjectsCommand,
        scope: Scope.Singleton,
    },
    // Dao Proposals
    {
        bind: GetDaoProposalsCommandApi,
        to: GetDaoProposalsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetOpenDaoProposalsCommandApi,
        to: GetOpenDaoProposalsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetDaoProposalByIdCommandApi,
        to: GetDaoProposalByIdCommand,
        scope: Scope.Singleton,
    },
    // Metrics
    {
        bind: CalculateMetricsCommandApi,
        to: CalculateMetricsCommand,
        scope: Scope.Singleton,
    },
];

export default config;
