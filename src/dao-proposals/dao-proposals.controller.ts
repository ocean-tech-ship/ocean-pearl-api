import {
    Controller,
    Get,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiOkResponse,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { GetRoundsAmountService } from '../rounds/services/get-rounds-amount.service';
import { ProposalsFilterQuery } from './models/ProposalsFilterQuery.model';
import { GetDaoProposalByIdService } from './services/get-dao-proposal-by-id.service';
import { GetDaoProposalsPaginatedService } from './services/get-dao-proposals-paginated.service';
import { GetFilteredDaoProposalsService } from './services/get-filtered-dao-proposals.service';

@ApiTags('proposals')
@Controller('dao-proposals')
export class DaoProposalsController {
    public constructor(
        private getFilteredDaoProposalsService: GetFilteredDaoProposalsService,
        private getDaoProposalByIdService: GetDaoProposalByIdService,
        private getDaoProposalsPaginatedService: GetDaoProposalsPaginatedService,
        private getRoundsAmountService: GetRoundsAmountService,
    ) {}

    @Get('')
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiOkResponse({
        description: 'OK.',
        schema: {
            properties: {
                daoProposals: {
                    type: 'array',
                    items: { $ref: getSchemaPath(DaoProposal) },
                },
                maxRounds: {
                    type: 'number',
                },
            },
        },
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getFilteredDaoProposals(
        @Query() proposalsFilterQuery: ProposalsFilterQuery,
    ): Promise<{
        daoProposals: DaoProposal[];
        maxRounds: number;
    }> {
        try {
            return {
                daoProposals: await this.getFilteredDaoProposalsService.execute(
                    proposalsFilterQuery,
                ),
                maxRounds: await this.getRoundsAmountService.execute(),
            };
        } catch (error: any) {
            throw error;
        }
    }

    @Get('paginated/:page/:limit')
    async getDaoProposalsPaginated(
        @Param('page') page: string,
        @Param('limit') limit: string,
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
    @ApiOkResponse({
        type: DaoProposal,
        description: 'Returns a single Proposal',
    })
    async getDaoProposalById(@Param('id') id: string): Promise<DaoProposal> {
        try {
            return await this.getDaoProposalByIdService.execute(id);
        } catch (error: any) {
            throw error;
        }
    }
}
