import { ContainerConfiguration, Scope } from 'typescript-ioc';
import {
    GetFeaturedProjectsCommand,
    GetFeaturedProjectsCommandApi,
    GetProjectByIdCommand,
    GetProjectByIdCommandApi,
} from '.';
import { GetDaoProposalsCommandApi } from './dao-proposal/api/get-dao-proposals-command.api';
import { GetDaoProposalByIdCommandApi } from './dao-proposal/api/get-doa-proposals-by-id-command.api';
import { GetFeaturedDaoProposalsCommandApi } from './dao-proposal/api/get-featured-dao-proposals-comand.api';
import { GetDaoProposalsCommand } from './dao-proposal/command/get-dao-proposals.command';
import { GetDaoProposalByIdCommand } from './dao-proposal/command/get-doa-proposal-by-id.command';
import { GetFeaturedDaoProposalsCommand } from './dao-proposal/command/get-featured-doa-proposals.command';
import { GetProjectsCommandApi } from './project/api/get-projects-command.api';
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
        bind: GetDaoProposalsCommandApi,
        to: GetDaoProposalsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetFeaturedDaoProposalsCommandApi,
        to: GetFeaturedDaoProposalsCommand,
        scope: Scope.Singleton,
    },
    {
        bind: GetDaoProposalByIdCommandApi,
        to: GetDaoProposalByIdCommand,
        scope: Scope.Singleton,
    },
];

export default config;
