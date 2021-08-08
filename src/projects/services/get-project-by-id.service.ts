import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class GetProjectByIdService {
    constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(id: string): Promise<Project> {
        return await this.projectRepository.getByID(id);
    }
}
