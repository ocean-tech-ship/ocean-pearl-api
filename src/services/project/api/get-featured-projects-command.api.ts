import { ProjectInterface } from '../../../database';

export abstract class GetFeaturedProjectsCommandApi {
    abstract execute(): Promise<ProjectInterface[]>;
}