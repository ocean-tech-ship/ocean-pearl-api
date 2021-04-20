import { Inject } from "typescript-ioc";
import { ProjectInterface, ProjectRepository } from '../../database';
import { ProjectApi } from "./project.api";

export class ProjectService implements ProjectApi {
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository,
    ) {
        this.projectRepository = projectRepository;
    }

    async getProjects(): Promise<ProjectInterface[]> {
        return await this.projectRepository.getAll();
    }

    async getFeaturedProjects(): Promise<ProjectInterface[]> {
        let projects: ProjectInterface[] = await this.projectRepository.getAll();

        return projects.slice(0, 4);
    }

    async getProjectById(id: string): Promise<ProjectInterface> {
        return await this.projectRepository.getByID(id);
    }
}
