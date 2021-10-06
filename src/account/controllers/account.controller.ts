import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';
import { ProjectGuard } from '../guards/project.guard';
import { AssociatedProject } from '../models/associated-project.model';
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

    @Put('/project/:id')
    @ApiBody({
        type: UpdatedProject,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(ProjectGuard)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'logo', maxCount: 1 },
                {
                    name: 'newPictures',
                    maxCount: UpdateProjectService.MAX_PICTURES_SIZE,
                },
            ],
            {
                limits: {
                    fileSize: 4000000,
                },
            },
        ),
    )
    public async updateProject(
        @Req() request: Request,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File;
            newPictures?: Express.Multer.File[];
        },
        @Param('id') id: string,
        @Body() project: UpdatedProject,
    ): Promise<AssociatedProject[]> {
        try {
            project.logo = files.logo;
            project.newPictures = files.newPictures;

            await this.updateProjectService.execute(id, project);

            const user = request.user as AuthenticatedUser;

            return await this.getAssociatedProjectsService.execute(user.wallet);
        } catch (error) {
            throw error;
        }
    }
}
