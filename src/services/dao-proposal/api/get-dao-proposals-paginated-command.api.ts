import { DaoProposalInterface } from '../../../database';
import { PaginationOptionsInterface } from '../../../database/interfaces/pagination-options.interface';

export abstract class GetDaoProposalsPaginatedCommandApi {
    abstract execute(options: PaginationOptionsInterface): Promise<DaoProposalInterface[]>;
}
