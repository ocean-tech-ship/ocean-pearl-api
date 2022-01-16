import { FilterQuery } from 'mongoose';

export interface FindQuery<T> {
    find?: FilterQuery<T>;
    sort?: FilterQuery<any>;
    limit?: number;
    page?: number
}