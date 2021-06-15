import { Inject } from 'typescript-ioc';
import { GetProjectsCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';
import { FindQueryInterface } from '../../../database/interfaces/find-query.interface';

export class GetProjectsCommand implements GetProjectsCommandApi {
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(): Promise<ProjectInterface[]> {
        let query: FindQueryInterface = {
            sort: { createdAt: -1 },
        };

        return await this.projectRepository.getAll(query);
    }
}
