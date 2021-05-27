import { ProjectInterface } from '../../../database';

export abstract class GetProjectsCommandApi {
    abstract execute(): Promise<ProjectInterface[]>;
}