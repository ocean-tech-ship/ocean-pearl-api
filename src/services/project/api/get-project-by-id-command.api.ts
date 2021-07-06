import { ProjectInterface } from '../../../database';

export abstract class GetProjectByIdCommandApi {
    abstract execute(id: string): Promise<ProjectInterface>;
}