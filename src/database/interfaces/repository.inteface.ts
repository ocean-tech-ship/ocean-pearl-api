import { Document, Model, QueryOptions, Types } from 'mongoose';
import { FindQuery } from './find-query.interface';

export interface RepositoryInterface<T extends Document> {
    getByID(id: string): Promise<any>;

    getAll(query: FindQuery<T>): Promise<any[]>;

    findOne(query: FindQuery<T>): Promise<any>;

    findOneRaw(query: FindQuery<T>): Promise<any>;

    update(model: T, options: QueryOptions): Promise<boolean>;

    create(model: T): Promise<Types.ObjectId>;

    delete(query: FindQuery<T>): Promise<boolean>;

    deleteMany(query: FindQuery<T>): Promise<boolean>;

    getModel(): Model<T>;
}
