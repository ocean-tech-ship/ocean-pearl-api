import { ContainerConfiguration, Scope } from 'typescript-ioc';
import { ProjectApi, ProjectService } from '.';
import { DaoProposalApi } from './dao-proposal/dao-proposal.api';
import { DaoProposalService } from './dao-proposal/dao-proposal.service';

const config: ContainerConfiguration[] = [
    {
        bind: ProjectApi,
        to: ProjectService,
        scope: Scope.Singleton,
    },
    {
        bind: DaoProposalApi,
        to: DaoProposalService,
        scope: Scope.Singleton,
    },
];

export default config;
