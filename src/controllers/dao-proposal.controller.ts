import { Types } from 'mongoose';
import { Inject } from 'typescript-ioc';
import { GET, Path, PathParam } from 'typescript-rest';
import { DaoProposalInterface } from '../database';
import { LoggerApi } from '../logger';
import { DaoProposalService } from '../services/dao-proposal/dao-proposal.service';

@Path('/dao-proposal')
export class DaoProposalController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    daoProposalService: DaoProposalService;

    get logger() {
        return this._baseLogger.child('DaoProposalController');
    }

    @GET
    async getProjects(): Promise<DaoProposalInterface[]> {
        try {
            return await this.daoProposalService.getDaoProposals();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('featured')
    @GET
    async getFeaturedProjectList(): Promise<DaoProposalInterface[]> {
        try {
            return await this.daoProposalService.getFeaturedDaoProposals();
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    @Path('detail/:id')
    @GET
    async getProjectById(
        @PathParam('id') id: string
    ): Promise<DaoProposalInterface> {
        try {
            return await this.daoProposalService.getDaoProposalById(
                new Types.ObjectId(id)
            );
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
