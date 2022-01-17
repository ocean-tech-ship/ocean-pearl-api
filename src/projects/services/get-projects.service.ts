import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { PaginatedResponse } from '../../database/models/paginated-response.model';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project, ProjectType } from '../../database/schemas/project.schema';
import { ProjectFilterQuery } from '../models/project-filter-query.model';

@Injectable()
export class GetProjectsService {
    private readonly paginationQueryKeys: string[] = ['limit', 'page']; 

    constructor(private projectRepository: ProjectRepository) {}

    public async execute(
        projectFilterQuery: ProjectFilterQuery,
    ): Promise<PaginatedResponse<Project>> {
        const query: FindQuery<ProjectType> = {
            find: {},
            sort: { updatedAt: -1 },
        };

        for (const [key, value] of Object.entries(projectFilterQuery)) {
            if (key === 'search') {
                query.find.title = {
                    $regex: value,
                    $options: 'i',
                };

                continue;
            }

            if (this.paginationQueryKeys.includes(key)) {
                query[key] = value;
                continue;
            }

            query.find[key] = value;
        }

        return await this.projectRepository.getPaginated(query);
    }
}
