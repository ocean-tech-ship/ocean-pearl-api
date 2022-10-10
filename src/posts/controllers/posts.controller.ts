import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponse } from '../../database/models/paginated-response.model';
import { Pagination } from '../../database/models/pagination.model';
import { Post } from '../../database/schemas/post.schema';
import { PostFilterQuery } from '../models/post-filter-query.model';
import { GetPostsService } from '../services/get-posts.service';
import { GetPostByIdService } from '../services/get-post-by-id.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    public constructor(
        private getPostsService: GetPostsService,
        private getPostByIdService: GetPostByIdService,
    ) {}

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

    @Get(':id')
    @ApiNotFoundResponse()
    @ApiOkResponse({
        type: Post,
        description: 'Returns a single Post',
    })
    public async getPostById(@Param('id') id: string): Promise<Post> {
        try {
            const post: Post = await this.getPostByIdService.execute(id);

            if (!post) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `No Post found with id: ${id}`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return post;
        } catch (error: any) {
            throw error;
        }
    }
}
