import { Container } from "typescript-ioc";

export * from './hello-world.api';
export * from './hello-world.service';

export * from './project/api/getFeaturedProjectsCommand.api';
export * from './project/api/getProjectByIdCommand.api';
export * from './project/api/getProjectsCommand.api';
export * from './project/command/get-featured-projects.command';
export * from './project/command/get-project-by-id.command';
export * from './project/command/get-projects.command';

export * from './dao-proposal/dao-proposal.api';
export * from './dao-proposal/dao-proposal.service';

import config from './ioc.config';

Container.configure(...config);