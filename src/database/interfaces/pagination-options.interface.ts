import { FilterQuery } from 'mongoose';

export interface PaginationOptionsInterface {
    page: number;
    limit: number;
    find?: FilterQuery<any>;
    sort?: FilterQuery<any>;
}
