import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { PaginatedResponse } from '../../database/models/paginated-response.model';
import { PostRepository } from '../../database/repositories/post.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Post } from '../../database/schemas/post.schema';
import { ProjectType } from '../../database/schemas/project.schema';
import { PostFilterQuery } from '../models/post-filter-query.model';

@Injectable()
export class GetPostsService {
    private readonly paginationQueryKeys: string[] = ['limit', 'page'];

    constructor(
        private postRepository: PostRepository,
        private projectRepository: ProjectRepository,
    ) {}

    public async execute(postFilterQuery: PostFilterQuery): Promise<PaginatedResponse<Post>> {
        const query: FindQuery<ProjectType> = {
            find: {},
            sort: { updatedAt: -1 },
        };

        for (const [key, value] of Object.entries(postFilterQuery)) {
            if (key === 'search') {
                query.find.title = {
                    $regex: value,
                    $options: 'i',
                };

                continue;
            }

            if (key === 'project') {
                query.find.project = await this.getProjectIds(value);

                continue;
            }

            if (this.paginationQueryKeys.includes(key)) {
                query[key] = value;
                continue;
            }

            query.find[key] = value;
        }

        return await this.postRepository.getPaginated(query);
    }

    private async getProjectIds(projectTitle: string): Promise<Types.ObjectId[]> {
        const projectIds = [];
        const projects = await this.projectRepository.getAllRaw({
            find: {
                title: {
                    $regex: projectTitle,
                    $options: 'i',
                },
            },
        });

        for (const project of projects) {
            projectIds.push(project._id);
        }

        return projectIds;
    }
}
