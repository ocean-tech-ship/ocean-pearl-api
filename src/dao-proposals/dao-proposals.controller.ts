import { Controller, Get, Param } from '@nestjs/common';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { GetDaoProposalByIdService } from './services/get-dao-proposal-by-id.service';
import { GetDaoProposalsPaginatedService } from './services/get-dao-proposals-paginated.service';
import { GetDaoProposalsService } from './services/get-dao-proposals.service';

@Controller('dao-proposals')
export class DaoProposalsController {

    public constructor(
        private getDaoProposalsService: GetDaoProposalsService,
        private getDaoProposalByIdService: GetDaoProposalByIdService,
        private getDaoProposalsPaginatedService: GetDaoProposalsPaginatedService
    ) {}

    @Get()
    async getDaoProposals(): Promise<DaoProposal[]> {
        try {
            return await this.getDaoProposalsService.execute();
        } catch (error: any) {
            throw error
        }
    }

    @Get('paginated/:page/:limit')
    async getDaoProposalsPaginated(
        @Param('page') page: string,
        @Param('limit') limit: string
    ): Promise<DaoProposal[]> {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
            } as PaginationOptions;

            return await this.getDaoProposalsPaginatedService.execute(options);
        } catch (error: any) {
            throw error;
        }
    }

    @Get(':id')
    async getDaoProposalById(
        @Param('id') id: string
    ): Promise<DaoProposal> {
        try {
            return await this.getDaoProposalByIdService.execute(id);
        } catch (error: any) {
            throw error;
        }
    }
}
