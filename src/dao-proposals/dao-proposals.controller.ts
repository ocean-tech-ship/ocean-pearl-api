import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { GetRoundsAmountService } from '../rounds/services/get-rounds-amount.service';
import { ProposalFilterQuery } from './models/proposal-filter-query.model';
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
    @ApiBadRequestResponse()
    @ApiOkResponse({
        description: 'Ok.',
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
        @Query() proposalFilterQuery: ProposalFilterQuery,
    ): Promise<{
        daoProposals: DaoProposal[];
        maxRounds: number;
    }> {
        try {
            return {
                daoProposals: await this.getFilteredDaoProposalsService.execute(
                    proposalFilterQuery,
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
    @ApiNoContentResponse()
    @ApiOkResponse({
        type: DaoProposal,
        description: 'Returns a single Proposal',
    })
    async getDaoProposalById(@Param('id') id: string): Promise<DaoProposal> {
        try {
            const proposal = await this.getDaoProposalByIdService.execute(id);

            if (!proposal) {
                throw new HttpException(
                    {
                        status: HttpStatus.NO_CONTENT,
                        error: `No Project found with id: ${id}`,
                    },
                    HttpStatus.NO_CONTENT,
                );
            }

            return proposal;
        } catch (error: any) {
            throw error;
        }
    }
}
