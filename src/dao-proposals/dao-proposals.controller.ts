import { Controller, Get, Param } from '@nestjs/common';
import { PaginationOptions } from '../database/interfaces/pagination-options.interface';
import { RoundRepository } from '../database/repositories/round.repository';
import { DaoProposal } from '../database/schemas/dao-proposal.schema';
import { GetDaoProposalByIdService } from './services/get-dao-proposal-by-id.service';
import { GetDaoProposalsByRoundService } from './services/get-dao-proposals-by-round.service';
import { GetDaoProposalsPaginatedService } from './services/get-dao-proposals-paginated.service';

@Controller('dao-proposals')
export class DaoProposalsController {
    public constructor(
        private getDaoProposalsByRoundService: GetDaoProposalsByRoundService,
        private getDaoProposalByIdService: GetDaoProposalByIdService,
        private getDaoProposalsPaginatedService: GetDaoProposalsPaginatedService,
        private roundRepository: RoundRepository,
    ) {}

    @Get()
    async getDaoProposals(): Promise<DaoProposal[]> {
        try {
            const currentDate = new Date();
            let currentRound = (
                await this.roundRepository.getAll({
                    find: {
                        startDate: { $lte: currentDate },
                        votingEndDate: { $gte: currentDate },
                    },
                })
            )[0];

            if (!currentRound) {
                currentRound = (
                    await this.roundRepository.getAll({
                        find: {
                            votingEndDate: { $lte: currentDate },
                        },
                        sort: {
                            votingEndDate: -1
                        }
                    })
                )[0]
            }

            return await this.getDaoProposalsByRoundService.execute(currentRound._id);
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
    async getDaoProposalById(@Param('id') id: string): Promise<DaoProposal> {
        try {
            return await this.getDaoProposalByIdService.execute(id);
        } catch (error: any) {
            throw error;
        }
    }
}
