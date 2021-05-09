import { Types } from 'mongoose';
import { Inject } from 'typescript-ioc';
import { ProjectInterface, ProjectRepository } from '../../database';
import { ProjectApi } from './project.api';

export class ProjectService implements ProjectApi {
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    async getProjects(): Promise<ProjectInterface[]> {
        return await this.projectRepository.getAll();
    }

    async getFeaturedProjects(): Promise<ProjectInterface[]> {
        let projects: ProjectInterface[] = await this.projectRepository.getPaginated(
            1,
            4
        );

        return projects;
    }

    async getProjectById(id: Types.ObjectId): Promise<ProjectInterface> {
        return await this.projectRepository.getByID(id);
    }
}
