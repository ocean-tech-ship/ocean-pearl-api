import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { PaginationOptionsInterface } from '../../../database/interfaces/pagination-options.interface';
import { GetDaoProposalsPaginatedCommandApi } from '../api/get-dao-proposals-paginated-command.api';

export class GetDaoProposalsPaginatedCommand
    implements GetDaoProposalsPaginatedCommandApi
{
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(options: PaginationOptionsInterface): Promise<DaoProposalInterface[]> {
        return this.daoProposalRepository.getPaginated(options);
    }
}
