import { ProjectInterface } from '../../../database';
import { PaginationOptionsInterface } from '../../../database/interfaces/pagination-options.interface';

export abstract class GetProjectsPaginatedCommandApi {
    abstract execute(
        options: PaginationOptionsInterface
    ): Promise<ProjectInterface[]>;
}
