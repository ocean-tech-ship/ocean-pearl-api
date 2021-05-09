import { ProjectService } from '../services/project/project.service';
import { GET, Path, PathParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { ProjectInterface } from '../database';
import { Types } from 'mongoose';

@Path('/project')
export class ProjectController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    projectService: ProjectService;

    get logger() {
        return this._baseLogger.child('ProjectController');
    }

    @GET
    async getProjects(): Promise<Array<ProjectInterface>> {
        try {
            return await this.projectService.getProjects();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('featured')
    @GET
    async getFeaturedProjectList(): Promise<Array<ProjectInterface>> {
        try {
            return await this.projectService.getFeaturedProjects();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('detail/:id')
    @GET
    async getProjectById(
        @PathParam('id') id: string
    ): Promise<ProjectInterface> {
        try {
            return await this.projectService.getProjectById(
                new Types.ObjectId(id)
            );
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
