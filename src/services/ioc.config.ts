import { ContainerConfiguration, Scope } from 'typescript-ioc';
import {
    GetFeaturedProjectsCommand,
    GetFeaturedProjectsCommandApi,
    GetProjectByIdCommand,
    GetProjectByIdCommandApi,
} from '.';
import { DaoProposalApi } from './dao-proposal/dao-proposal.api';
import { DaoProposalService } from './dao-proposal/dao-proposal.service';
import { GetProjectsCommandApi } from './project/api/getProjectsCommand.api';
import { GetProjectsCommand } from './project/command/get-projects.command';

const config: ContainerConfiguration[] = [
    {
        bind: GetProjectsCommandApi,
        to: GetProjectsCommand,
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
        bind: DaoProposalApi,
        to: DaoProposalService,
        scope: Scope.Singleton,
    },
];

export default config;
