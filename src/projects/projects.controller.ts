import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    getSchemaPath
} from '@nestjs/swagger';
import { PaginatedResponse } from '../database/models/paginated-response.model';
import { Pagination } from '../database/models/pagination.model';
import { Project } from '../database/schemas/project.schema';
import { ProjectFilterQuery } from './models/project-filter-query.model';
import { GetProjectByIdService } from './services/get-project-by-id.service';
import { GetProjectsService } from './services/get-projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    public constructor(
        private getProjectsService: GetProjectsService,
        private getProjectByIdService: GetProjectByIdService,
    ) {}

    @Get()
    @ApiBadRequestResponse()
    @ApiOkResponse({
        description: 'Ok.',
        schema: {
            properties: {
                docs: {
                    type: 'array',
                    items: { $ref: getSchemaPath(Project) },
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
        @Query() projectFilterQuery: ProjectFilterQuery,
    ): Promise<PaginatedResponse<Project>> {
        try {
            return await this.getProjectsService.execute(
                projectFilterQuery,
            );
        } catch (error: any) {
            throw error;
        }
    }

    @Get(':id')
    @ApiNotFoundResponse()
    @ApiOkResponse({
        type: Project,
        description: 'Returns a single Project',
    })
    public async getProjectById(@Param('id') id: string): Promise<Project> {
        try {
            const project: Project = await this.getProjectByIdService.execute(
                id,
            );

            if (!project) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `No Project found with id: ${id}`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return project;
        } catch (error: any) {
            throw error;
        }
    }
}
