import { GET, Path, PathParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { ProjectInterface } from '../database';
import { Types } from 'mongoose';
import { GetProjectByIdCommand, GetProjectsCommand } from '../services';
import { PaginationOptionsInterface } from '../database/interfaces/pagination-options.interface';
import { GetProjectsPaginatedCommand } from '../services/project/command/get-projects-paginated.command';

@Path('/projects')
export class ProjectController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    getProjectsCommand: GetProjectsCommand;
    @Inject
    getProjectByIdCommand: GetProjectByIdCommand;
    @Inject
    getProjectsPaginatedCommand: GetProjectsPaginatedCommand;

    get logger() {
        return this._baseLogger.child('ProjectController');
    }

    @GET
    async getProjects(): Promise<ProjectInterface[]> {
        try {
            return await this.getProjectsCommand.execute();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('paginated/:page/:limit')
    @GET
    async getProjectPaginated(
        @PathParam('page') page: number,
        @PathParam('limit') limit: number
    ) {
        try {
            const options = <PaginationOptionsInterface>{
                page: page,
                limit: limit,
            };

            return this.getProjectsPaginatedCommand.execute(options);
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
            return await this.getProjectByIdCommand.execute(
                new Types.ObjectId(id)
            );
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
