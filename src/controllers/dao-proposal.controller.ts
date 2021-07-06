import { Types } from 'mongoose';
import { Inject } from 'typescript-ioc';
import { GET, Path, PathParam } from 'typescript-rest';
import { DaoProposalInterface } from '../database';
import { PaginationOptionsInterface } from '../database/interfaces/pagination-options.interface';
import { LoggerApi } from '../logger';
import { GetDaoProposalByIdCommand, GetDaoProposalsCommand } from '../services';
import { GetDaoProposalsPaginatedCommand } from '../services/dao-proposal/command/get-dao-proposals-paginated.command';

@Path('/dao-proposals')
export class DaoProposalController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    getDaoProposalsCommand: GetDaoProposalsCommand;
    @Inject
    getDaoProposalByIdCommand: GetDaoProposalByIdCommand;
    @Inject
    getDaoProposalsPaginatedCommand: GetDaoProposalsPaginatedCommand;

    get logger() {
        return this._baseLogger.child('DaoProposalController');
    }

    @GET
    async getDaoProposals(): Promise<DaoProposalInterface[]> {
        try {
            return await this.getDaoProposalsCommand.execute();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('paginated/:page/:limit')
    @GET
    async getDaoProposalsPaginated(
        @PathParam('page') page: number,
        @PathParam('limit') limit: number
    ): Promise<DaoProposalInterface[]> {
        try {
            const options = <PaginationOptionsInterface>{
                page: page,
                limit: limit,
            };

            return await this.getDaoProposalsPaginatedCommand.execute(options);
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('detail/:id')
    @GET
    async getDaoProposalById(
        @PathParam('id') id: string
    ): Promise<DaoProposalInterface> {
        try {
            return await this.getDaoProposalByIdCommand.execute(id);
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
