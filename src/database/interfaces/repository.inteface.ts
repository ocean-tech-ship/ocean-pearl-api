import { Document, Types } from "mongoose";

export interface RepositoryInterface<T extends Document> {
    getByID(id: Types.ObjectId): Promise<T>;

    getAll(): Promise<T[]>;

    update(model: T): Promise<boolean>;

    create(model: T): Promise<Types.ObjectId>;

    delete(id: Types.ObjectId): Promise<boolean>;
}