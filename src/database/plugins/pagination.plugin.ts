import { FilterQuery, Model, Schema } from 'mongoose';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Pagination } from '../models/pagination.model';

export function paginateFactory<T extends Model<T>>() {
    return async function paginate<T>(
        query: FilterQuery<T>,
        options: PaginationOptions<T>,
        callback: Function,
    ): Promise<PaginatedResponse<T>> {
        const defaultOptions = {
            collation: {},
            lean: true,
            page: 1,
            limit: 0,
            projection: {},
            select: '',
            options: {},
            useEstimatedCount: false,
            forceCountFn: false,
            allowDiskUse: false,
        } as PaginationOptions<T>;

        options = {
            ...defaultOptions,
            ...options,
            ...options.options,
        };

        const skippedEntries: number = (options.page - 1 ) * options.limit;

        const mongoQuery = this.find(query, options.projection)
            .select(options.select)
            .sort(options.sort)
            .lean(options.lean)
            .skip((options.page - 1 ) * options.limit)
            .limit(options.limit);

        if (options.populate) {
            mongoQuery.populate(options.populate);
        }

        if (options.allowDiskUse) {
            mongoQuery.allowDiskUse();
        }

        const docsPromise = mongoQuery.exec();
        const countPromise = options.useEstimatedCount
            ? this.estimatedDocumentCount().exec()
            : this.countDocuments(query).exec();

        return Promise.all([countPromise, docsPromise])
            .then((values) => {
                const [count, docs] = values;

                const totalPages: number =
                    options.limit > 0 ? Math.ceil(count / options.limit) : 0;
                const hasPrevPage: boolean = options.page > 1;
                const hasNextPage: boolean = options.page < totalPages;

                const pagination: Pagination = {
                    page: options.page,
                    limit: options.limit,
                    totalDocs: count,
                    totalPages: totalPages,
                    prevPage: hasPrevPage ? options.page - 1 : null,
                    nextPage: hasNextPage ? options.page + 1 : null,
                    pagingCounter: skippedEntries + 1,
                    hasPrevPage: hasPrevPage,
                    hasNextPage: hasNextPage,
                };

                const result = {
                    docs,
                    pagination: pagination,
                } as PaginatedResponse<T>;

                return callback
                    ? callback(null, result)
                    : Promise.resolve(result);
            })
            .catch((error) => {
                return callback ? callback(error) : Promise.reject(error);
            });
    };
}

export function PaginatePlugin<T extends Model<T>>(schema: Schema) {
    schema.statics.paginate = paginateFactory<T>();
    return schema;
}
