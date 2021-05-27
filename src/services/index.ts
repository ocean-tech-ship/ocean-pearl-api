import { Container } from "typescript-ioc";

export * from './hello-world.api';
export * from './hello-world.service';

export * from './project/api/get-featured-projects-command.api';
export * from './project/api/get-project-by-id-command.api';
export * from './project/api/get-projects-command.api';
export * from './project/command/get-featured-projects.command';
export * from './project/command/get-project-by-id.command';
export * from './project/command/get-projects.command';

export * from './dao-proposal/api/get-dao-proposals-command.api';
export * from './dao-proposal/api/get-doa-proposals-by-id-command.api';
export * from './dao-proposal/api/get-featured-dao-proposals-comand.api';
export * from './dao-proposal/command/get-dao-proposals.command';
export * from './dao-proposal/command/get-doa-proposal-by-id.command';
export * from './dao-proposal/command/get-featured-doa-proposals.command';

import config from './ioc.config';

Container.configure(...config);