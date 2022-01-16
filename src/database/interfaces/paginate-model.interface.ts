import { FilterQuery, Model } from 'mongoose';
import { PaginatedResponse } from '../models/paginated-response.model';
import { PaginationOptions } from './pagination-options.interface';

export interface PaginateModel<T> extends Model<T> {
    paginate(
        query?: FilterQuery<T>,
        options?: PaginationOptions<T>,
        callback?: (err: any, result: PaginatedResponse<T>) => void,
    ): Promise<PaginatedResponse<T>>;
}
