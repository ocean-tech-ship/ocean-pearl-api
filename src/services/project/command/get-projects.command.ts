import { Inject } from 'typescript-ioc';
import { GetProjectsCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';

export class GetProjectsCommand implements GetProjectsCommandApi {
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(): Promise<ProjectInterface[]> {
        return await this.projectRepository.getAll();
    }
}
