import { Injectable } from '@nestjs/common';
import { DaoProposalStatusEnum } from '../../database/enums/dao-proposal-status.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetOpenDaoProposalsService
{
    constructor(
        private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(
        fundingRound?: number
    ): Promise<DaoProposal[]> {
        let query: FindQuery = {
            find: { status: DaoProposalStatusEnum.Running },
        };

        if (fundingRound) {
            query.find.fundingRound = fundingRound;
        }

        return await this.daoProposalRepository.getAll(query);
    }
}
