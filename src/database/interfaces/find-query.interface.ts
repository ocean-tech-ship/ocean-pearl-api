import { FilterQuery } from 'mongoose';

export interface FindQuery {
    find?: FilterQuery<any>;
    sort?: FilterQuery<any>;
}