import { GET, Path, PathParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { ProjectInterface } from '../database';
import { Types } from 'mongoose';
import { GetFeaturedProjectsCommand, GetProjectByIdCommand, GetProjectsCommand } from '../services';

@Path('/project')
export class ProjectController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    getProjectsCommand: GetProjectsCommand;
    @Inject
    getFeaturedProjectsCommand: GetFeaturedProjectsCommand;
    @Inject
    getProjectByIdCommand: GetProjectByIdCommand;

    get logger() {
        return this._baseLogger.child('ProjectController');
    }

    @GET
    async getProjects(): Promise<Array<ProjectInterface>> {
        try {
            return await this.getProjectsCommand.execute();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('featured')
    @GET
    async getFeaturedProjectList(): Promise<ProjectInterface[]> {
        try {
            return await this.getFeaturedProjectsCommand.execute();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('latest')
    @GET
    async getLatestProjects(): Promise<ProjectInterface[]> {
        return;
    }

    @Path('detail/:id')
    @GET
    async getProjectById(
        @PathParam('id') id: string
    ): Promise<ProjectInterface> {
        try {
            return await this.getProjectByIdCommand.execute(
                new Types.ObjectId(id)
            );
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
