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

    async execute(): Promise<ProjectInterface[]> {
        return await this.projectRepository.getPaginated(1, 4);
    }
}
