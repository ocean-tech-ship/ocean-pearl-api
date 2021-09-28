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
} from '@nestjs/swagger';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { Project } from '../database/schemas/project.schema';
import { ProjectFilterQuery } from './models/project-filter-query.model';
import { GetFilteredProjectsService } from './services/get-filtered-projects.service';
import { GetProjectByIdService } from './services/get-project-by-id.service';
import { GetProjectsPaginatedService } from './services/get-projects-paginated.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    public constructor(
        private getFilteredProjectsService: GetFilteredProjectsService,
        private getProjectByIdService: GetProjectByIdService,
        private getProjectsPaginatedService: GetProjectsPaginatedService,
    ) {}

    @Get()
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: Project,
        isArray: true,
        description: 'Returns all Projects',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getProjects(
        @Query() projectFilterQuery: ProjectFilterQuery,
    ): Promise<Project[]> {
        try {
            const filteredProjects = await this.getFilteredProjectsService.execute(
                projectFilterQuery,
            );

            return filteredProjects ?? [];
        } catch (error: any) {
            throw error;
        }
    }

    @Get('paginated/:page/:limit')
    async getProjectPaginated(
        @Param('page') page: string,
        @Param('limit') limit: string,
    ) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
            } as PaginationOptions;

            return this.getProjectsPaginatedService.execute(options);
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
    async getProjectById(@Param('id') id: string): Promise<Project> {
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
