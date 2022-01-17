import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal, DaoProposalType } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetDaoProposalsByRoundService
{
    constructor(
        private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(round: Types.ObjectId): Promise<DaoProposal[]> {
        const query: FindQuery<DaoProposalType> = {
            find: { fundingRound: round },
        };

        return await this.daoProposalRepository.getAll(query);
    }
}
