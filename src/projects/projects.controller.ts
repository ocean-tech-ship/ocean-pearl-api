import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { Project } from '../database/schemas/project.schema';
import { GetProjectByIdService } from './services/get-project-by-id.service';
import { GetProjectsPaginatedService } from './services/get-projects-paginated.service';
import { GetProjectsService } from './services/get-projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    public constructor(
        private getProjectsService: GetProjectsService,
        private getProjectByIdService: GetProjectByIdService,
        private getProjectsPaginatedService: GetProjectsPaginatedService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: Project,
        isArray: true,
        description: 'Returns all Projects',
    })
    async getProjects(): Promise<Project[]> {
        try {
            return await this.getProjectsService.execute();
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
                throw new Error(`No project Found with id: ${id}!`);
            }

            return project;
        } catch (error: any) {
            throw error;
        }
    }
}
