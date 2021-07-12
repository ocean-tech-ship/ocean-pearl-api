import { Injectable } from '@nestjs/common';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetDaoProposalByIdService {
    constructor(
        private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(id: string): Promise<DaoProposal> {
        return this.daoProposalRepository.getByID(id);
    }
}
