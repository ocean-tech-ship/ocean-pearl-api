import { ProjectInterface } from '../../../database';

export abstract class GetLatestProjectsComandApi {
    abstract execute(): Promise<ProjectInterface[]>;
}
