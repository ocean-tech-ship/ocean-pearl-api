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
import { WalletInfoParam } from '../../utils/wallet/decorators/wallet-info-parameter.decorator';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { ProjectCreationGuard } from '../guards/project-creation.guard';
import { ProjectGuard } from '../guards/project.guard';
import { LinkedProject } from '../models/linked-project.model';
import { NewProject } from '../models/new-project.model';
import { UpdatedProject } from '../models/updated-project.model';
import { CreateProjectService } from '../services/create-project.service';
import { GetLinkedProjectsService } from '../services/get-linked-projects.service';
import { UpdateProjectService } from '../services/update-project.service';

@ApiTags('account')
@UseGuards(AuthGuard('jwt-refresh'))
@Controller('account')
export class AccountController {
    public constructor(
        private getLinkedProjectsService: GetLinkedProjectsService,
        private updateProjectService: UpdateProjectService,
        private createProjectService: CreateProjectService,
    ) {}

    @Get()
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiOkResponse({
        description: 'List of all associated projects',
        schema: {
            properties: {
                projects: {
                    items: { $ref: getSchemaPath(LinkedProject) },
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
        projects: LinkedProject[];
    }> {
        const user = request.user as AuthenticatedUser;

        const projects = await this.getLinkedProjectsService.execute(user.wallet);

        return {
            wallet: user.wallet,
            projects: projects,
        };
    }

    @Put('/projects')
    @ApiBody({
        type: UpdatedProject,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(ProjectGuard)
    public async updateProject(
        @Req() request: Request,
        @Body() project: UpdatedProject,
    ): Promise<LinkedProject[]> {
        try {
            await this.updateProjectService.execute(project);

            const user = request.user as AuthenticatedUser;

            return await this.getLinkedProjectsService.execute(user.wallet);
        } catch (error) {
            throw error;
        }
    }

    @Post('/projects')
    @ApiBody({
        type: NewProject,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(ProjectCreationGuard)
    public async createProject(
        @Req() request: Request,
        @Body() project: NewProject,
        @WalletInfoParam() walletInfo: WalletInfo,
    ): Promise<LinkedProject[]> {
        try {
            await this.createProjectService.execute(project, walletInfo);

            const user = request.user as AuthenticatedUser;

            return await this.getLinkedProjectsService.execute(user.wallet);
        } catch (error) {
            throw error;
        }
    }
}
