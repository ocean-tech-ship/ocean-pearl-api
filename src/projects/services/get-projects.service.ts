import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class GetProjectsService {
    constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(): Promise<Project[]> {
        let query: FindQuery = {
            sort: { createdAt: -1 },
        };

        return await this.projectRepository.getAll(query);
    }
}
