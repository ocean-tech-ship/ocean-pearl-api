import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../../database/interfaces/pagination-options.interface';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetDaoProposalsPaginatedService
{
    constructor(
       private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(options: PaginationOptions): Promise<DaoProposal[]> {
        return this.daoProposalRepository.getPaginated(options);
    }
}
