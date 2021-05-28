import { Types } from 'mongoose';
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

    async execute(id: Types.ObjectId): Promise<ProjectInterface> {
        return await this.projectRepository.getByID(id);
    }
}