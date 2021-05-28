import { ProjectInterface } from '../../../database';

export abstract class GetDaoFeaturedProjectsCommandApi {
    abstract execute(): Promise<ProjectInterface[]>;
}
