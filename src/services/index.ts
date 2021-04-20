import { Container } from "typescript-ioc";

export * from './hello-world.api';
export * from './hello-world.service';

export * from './project/project.api';
export * from './project/project.service';

export * from './dao-proposal/dao-proposal.api';
export * from './dao-proposal/dao-proposal.service';

import config from './ioc.config';

Container.configure(...config);