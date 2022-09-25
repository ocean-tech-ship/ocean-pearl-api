import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponse } from '../../database/models/paginated-response.model';
import { Pagination } from '../../database/models/pagination.model';
import { Post } from '../../database/schemas/post.schema';
import { PostFilterQuery } from '../models/post-filter-query.model';
import { GetPostsService } from '../services/get-posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    public constructor(private getPostsService: GetPostsService) {}

    @Get()
    @ApiBadRequestResponse()
    @ApiOkResponse({
        description: 'Ok.',
        schema: {
            properties: {
                docs: {
                    type: 'array',
                    items: { $ref: getSchemaPath(Post) },
                },
                pagination: {
                    type: 'object',
                    $ref: getSchemaPath(Pagination),
                },
            },
        },
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    public async getProjects(
        @Query() postFilterQuery: PostFilterQuery,
    ): Promise<PaginatedResponse<Post>> {
        try {
            return this.getPostsService.execute(postFilterQuery);
        } catch (error: any) {
            throw error;
        }
    }
}
