import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { PaginatedResponse } from '../../database/models/paginated-response.model';
import { PostRepository } from '../../database/repositories/post.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Post } from '../../database/schemas/post.schema';
import { Project, ProjectType } from '../../database/schemas/project.schema';
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
                const linkedProject = await this.getProject(value);
                query.find.project = linkedProject._id;

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

    private async getProject(projectTitle: string): Promise<Project> {
        return await this.projectRepository.findOneRaw({
            find: {
                title: {
                    $regex: projectTitle,
                    $options: 'i',
                },
            },
        });
    }
}
