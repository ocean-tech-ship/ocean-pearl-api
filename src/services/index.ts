import { Container } from "typescript-ioc";

export * from './hello-world.api';
export * from './hello-world.service';

export * from './project/api/get-featured-projects-command.api';
export * from './project/api/get-project-by-id-command.api';
export * from './project/api/get-projects-command.api';
export * from './project/command/get-featured-projects.command';
export * from './project/command/get-project-by-id.command';
export * from './project/command/get-projects.command';

export * from './dao-proposal/dao-proposal.api';
export * from './dao-proposal/dao-proposal.service';

import config from './ioc.config';

Container.configure(...config);