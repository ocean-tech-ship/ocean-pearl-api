import { ProjectInterface } from '../database/model/project.model';
import { ProjectService } from '../services/project/project.service';
import { GET, Path, PathParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';

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
    async getProjects(): Promise<ProjectInterface[]> {
        try {
            return await this.projectService.getProjects();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('/featured')
    @GET
    async getFeaturedProjectList(): Promise<ProjectInterface[]> {
        try {
            return await this.projectService.getFeaturedProjects();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path(':id')
    @GET
    async getProjectById(
        @PathParam('id') id: string
    ): Promise<ProjectInterface> {
        try {
            return await this.projectService.getProjectById(id);
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
