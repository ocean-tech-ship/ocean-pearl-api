import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBody,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';
import { ProjectGuard } from '../guards/project.guard';
import { AssociatedProject } from '../models/associated-project.model';
import { UpdatedProject } from '../models/updated-project.model';
import { GetAssociatedProjectsService } from '../services/get-associated-projects.service';
import { UpdateProjectService } from '../services/update-project.servce';

@ApiTags('account')
@UseGuards(AuthGuard('jwt'))
@Controller('account')
export class AccountController {
    public constructor(
        private getAssociatedProjectsService: GetAssociatedProjectsService,
        private updateProjectService: UpdateProjectService
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
    public async getProjects(
        @Req() request: Request,
    ): Promise<{
        wallet: string;
        projects: AssociatedProject[];
    }> {
        const user = request.user as AuthenticatedUser;

        const projects = await this.getAssociatedProjectsService.execute(
            user.wallet,
        );

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
        @Body('project') project: UpdatedProject,
    ): Promise<void> {
        try {
            this.updateProjectService.execute(project);
        } catch (error) {
            throw error;
        }
    }
}
