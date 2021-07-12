import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetDaoProposalsService {
    constructor(
        private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(): Promise<DaoProposal[]> {
        let query: FindQuery = {
            sort: { fundingRound: -1 },
        };

        return await this.daoProposalRepository.getAll(query);
    }
}
