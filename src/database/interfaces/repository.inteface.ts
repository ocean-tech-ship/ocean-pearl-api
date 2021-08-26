import { Document, Model, Types } from "mongoose";
import { FindQuery } from './find-query.interface';

export interface RepositoryInterface<T extends Document> {
    getByID(id: string): Promise<any>;

    getAll(): Promise<any[]>;

    findOne(query: FindQuery): Promise<any>;

    findOneRaw(query: FindQuery): Promise<any>;

    update(model: T): Promise<boolean>;

    create(model: T): Promise<Types.ObjectId>;

    delete(id: string): Promise<boolean>;

    getModel(): Model<T>;
}