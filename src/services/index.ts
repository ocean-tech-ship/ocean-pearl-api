import { Container } from "typescript-ioc";

export * from './hello-world.api';
export * from './hello-world.service';

export * from './project/api/get-featured-projects-command.api';
export * from './project/api/get-project-by-id-command.api';
export * from './project/api/get-projects-command.api';
export * from './project/api/get-latest-projects-command.api';
export * from './project/api/get-dao-featured-projects-comand.api';
export * from './project/api/get-projects-paginated-command.api';
export * from './project/command/get-featured-projects.command';
export * from './project/command/get-project-by-id.command';
export * from './project/command/get-projects.command';
export * from './project/command/get-latest-projects.command';
export * from './project/command/get-dao-featured-projects.command';
export * from './project/command/get-projects-paginated.command';

export * from './dao-proposal/api/get-dao-proposals-command.api';
export * from './dao-proposal/api/get-doa-proposals-by-id-command.api';
export * from './dao-proposal/api/get-open-dao-proposals-comand.api';
export * from './dao-proposal/api/get-dao-proposals-paginated-command.api';
export * from './dao-proposal/api/get-latest-dao-proposal-command.api';
export * from './dao-proposal/api/get-dao-proposals-by-round-command.api';
export * from './dao-proposal/command/get-dao-proposals.command';
export * from './dao-proposal/command/get-doa-proposal-by-id.command';
export * from './dao-proposal/command/get-open-doa-proposals.command';
export * from './dao-proposal/command/get-dao-proposals-paginated.command';
export * from './dao-proposal/command/get-latest-dao-proposals.command';
export * from './dao-proposal/command/get-dao-proposals-by-round.command';

export * from './metrics/api/calculate-metrics-command.api';
export * from './metrics/command/calculate-metrics.command';

import config from './ioc.config';

Container.configure(...config);