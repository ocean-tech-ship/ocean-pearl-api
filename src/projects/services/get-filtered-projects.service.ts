import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';
import { ProjectFilterQuery } from '../models/project-filter-query.model';

@Injectable()
export class GetFilteredProjectsService {
    constructor(private projectRepository: ProjectRepository) {}

    public async execute(projectFilterQuery: ProjectFilterQuery): Promise<Project[]> {
        const query: FindQuery = {
            find: {},
            sort: { updatedAt: -1 },
        };

        for (const [key, value] of Object.entries(projectFilterQuery)) {
            if (!value) {
                continue;
            }

            if (key === 'search') {
                query.find.title = {
                    $regex: value,
                    $options: 'i',
                };

                continue;
            }

            query.find[key] = value;
        }

        return await this.projectRepository.getAll(query);
    }
}
