import { PopulateOptions, QueryOptions } from 'mongoose';

export interface PaginationOptions<T> {
    select?: T | string | undefined;
    sort?: Object | string | undefined;
    populate?:
        | PopulateOptions[]
        | string[]
        | PopulateOptions
        | string
        | PopulateOptions
        | undefined;
    projection?: any;
    lean?: boolean | undefined;
    leanWithId?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    useEstimatedCount?: boolean | undefined;
    forceCountFn?: boolean | undefined;
    allowDiskUse?: boolean | undefined;
    read?: ReadOptions | undefined;
    options?: QueryOptions | undefined;
}

export interface ReadOptions {
    pref: string;
    tags?: any[] | undefined;
}
