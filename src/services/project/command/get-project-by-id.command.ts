import { Inject } from 'typescript-ioc';
import { GetProjectByIdCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';

export class GetProjectByIdCommand implements GetProjectByIdCommandApi {
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(id: string): Promise<ProjectInterface> {
        return await this.projectRepository.getByID(id);
    }
}
