import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetLatestDaoProposalsService {
    constructor(private daoProposalRepository: DaoProposalRepository) {}

    public async execute(): Promise<DaoProposal[]> {
        const query: FindQuery = {
            sort: {
                createdAt: -1,
            },
        };

        const daoProposals = await this.daoProposalRepository.getAll(query);

        return daoProposals.splice(0, 4);
    }
}
