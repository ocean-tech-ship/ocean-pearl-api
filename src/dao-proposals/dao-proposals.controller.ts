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
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { Pagination } from '../database/models/pagination.model';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { GetCurrentRoundService } from '../rounds/services/get-current-round.service';
import { ProposalFilterQuery } from './models/proposal-filter-query.model';
import { GetDaoProposalByIdService } from './services/get-dao-proposal-by-id.service';
import { GetDaoProposalsService } from './services/get-dao-proposals.service';
import { GetFulltextProposalService } from './services/get-fulltext-proposal.service';

@ApiTags('proposals')
@Controller('dao-proposals')
export class DaoProposalsController {
    public constructor(
        private getDaoProposalsService: GetDaoProposalsService,
        private getDaoProposalByIdService: GetDaoProposalByIdService,
        private getCurrentRoundService: GetCurrentRoundService,
        private getFulltextProposalService: GetFulltextProposalService,
    ) {}

    @Get('')
    @ApiBadRequestResponse()
    @ApiOkResponse({
        description: 'Ok.',
        schema: {
            properties: {
                docs: {
                    type: 'array',
                    items: { $ref: getSchemaPath(DaoProposal) },
                },
                pagination: {
                    type: 'object',
                    $ref: getSchemaPath(Pagination),
                },
                maxRounds: {
                    type: 'number',
                },
            },
        },
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    public async getDaoProposals(@Query() proposalFilterQuery: ProposalFilterQuery): Promise<{
        docs: DaoProposal[];
        pagination: Pagination;
        maxRounds: number;
    }> {
        try {
            const paginatedData = await this.getDaoProposalsService.execute(proposalFilterQuery);

            return {
                docs: paginatedData.docs,
                pagination: paginatedData.pagination,
                maxRounds: (await this.getCurrentRoundService.execute()).round,
            };
        } catch (error: any) {
            throw error;
        }
    }

    @Get(':id')
    @ApiNotFoundResponse()
    @ApiOkResponse({
        type: DaoProposal,
        description: 'Returns a single Proposal',
    })
    public async getDaoProposalById(@Param('id') id: string): Promise<DaoProposal> {
        try {
            const proposal = await this.getDaoProposalByIdService.execute(id);

            if (!proposal) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `No Project found with id: ${id}`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return proposal;
        } catch (error: any) {
            throw error;
        }
    }

    @Get(':id/fulltext')
    @ApiNotFoundResponse()
    @ApiOkResponse()
    public async getFulltextProposalById(@Param('id') id: string): Promise<any> {
        const proposal = await this.getDaoProposalById(id);

        try {
            return await this.getFulltextProposalService.execute(proposal);
        } catch (error: any) {
            if (error.response?.status === HttpStatus.NOT_FOUND) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `No text was found for proposal with id: ${id}`,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            throw error;
        }
    }
}
