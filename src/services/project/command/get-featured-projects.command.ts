import { Inject } from 'typescript-ioc';
import { GetFeaturedProjectsCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';

export class GetFeaturedProjectsCommand implements GetFeaturedProjectsCommandApi{
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
