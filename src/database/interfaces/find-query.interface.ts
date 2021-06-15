import { FilterQuery } from 'mongoose';

export interface FindQueryInterface {
    find?: FilterQuery<any>;
    sort?: FilterQuery<any>;
}