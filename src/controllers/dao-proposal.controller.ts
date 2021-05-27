import { Types } from 'mongoose';
import { Inject } from 'typescript-ioc';
import { GET, Path, PathParam } from 'typescript-rest';
import { DaoProposalInterface } from '../database';
import { LoggerApi } from '../logger';
import { GetDaoProposalByIdCommand, GetDaoProposalsCommand, GetFeaturedDaoProposalsCommand } from '../services';

@Path('/dao-proposals')
export class DaoProposalController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    getDaoProposalsCommand: GetDaoProposalsCommand;
    @Inject
    getDaoProposalByIdCommand: GetDaoProposalByIdCommand;
    @Inject
    getFeaturedDaoProposalsCommand: GetFeaturedDaoProposalsCommand;

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

    @Path('featured')
    @GET
    async getFeaturedDaoProposals(): Promise<DaoProposalInterface[]> {
        try {
            return await this.getFeaturedDaoProposalsCommand.execute();
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
            return await this.getDaoProposalByIdCommand.execute(
                new Types.ObjectId(id)
            );
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
