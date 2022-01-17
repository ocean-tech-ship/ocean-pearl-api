import { Injectable } from '@nestjs/common';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal, DaoProposalType } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetLatestDaoProposalsService {
    constructor(private daoProposalRepository: DaoProposalRepository) {}

    public async execute(): Promise<DaoProposal[]> {
        const query: FindQuery<DaoProposalType> = {
            sort: {
                createdAt: -1,
            },
            limit: 4
        };

        return await this.daoProposalRepository.getAll(query);
    }
}
