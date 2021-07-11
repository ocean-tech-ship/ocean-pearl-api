import { FilterQuery } from 'mongoose';

export interface PaginationOptions {
    page: number;
    limit: number;
    find?: FilterQuery<any>;
    sort?: FilterQuery<any>;
}
