import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBody,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';
import { ProjectCreationGuard } from '../guards/project-creation.guard';
import { ProjectGuard } from '../guards/project.guard';
import { AssociatedProject } from '../models/associated-project.model';
import { CreateProject } from '../models/create-project.model';
import { UpdatedProject } from '../models/updated-project.model';
import { GetAssociatedProjectsService } from '../services/get-associated-projects.service';
import { UpdateProjectService } from '../services/update-project.service';

@ApiTags('account')
@UseGuards(AuthGuard('jwt-refresh'))
@Controller('account')
export class AccountController {
    public constructor(
        private getAssociatedProjectsService: GetAssociatedProjectsService,
        private updateProjectService: UpdateProjectService,
    ) {}

    @Get()
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiOkResponse({
        description: 'List of all associated projects',
        schema: {
            properties: {
                projects: {
                    items: { $ref: getSchemaPath(AssociatedProject) },
                    type: 'array',
                },
                wallet: {
                    type: 'string',
                },
            },
        },
    })
    public async getProjects(@Req() request: Request): Promise<{
        wallet: string;
        projects: AssociatedProject[];
    }> {
        const user = request.user as AuthenticatedUser;

        const projects = await this.getAssociatedProjectsService.execute(user.wallet);

        return {
            wallet: user.wallet,
            projects: projects,
        };
    }

    @Put('/project')
    @ApiBody({
        type: UpdatedProject,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(ProjectGuard)
    public async updateProject(
        @Req() request: Request,
        @Body() project: UpdatedProject,
    ): Promise<AssociatedProject[]> {
        try {
            await this.updateProjectService.execute(project);

            const user = request.user as AuthenticatedUser;

            return await this.getAssociatedProjectsService.execute(user.wallet);
        } catch (error) {
            throw error;
        }
    }

    @Post('/projects')
    @ApiBody({
        type: CreateProject,
    })
    @UseGuards(ProjectCreationGuard)
    public async createProject(@Req() request: Request, @Body() test: any): Promise<void> {
        console.log('CONTROLLER');
        console.log(test);
    }
}
