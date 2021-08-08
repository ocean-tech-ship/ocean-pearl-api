import { Document, Model, Types } from "mongoose";

export interface RepositoryInterface<T extends Document> {
    getByID(id: string): Promise<any>;

    getAll(): Promise<any[]>;

    update(model: T): Promise<boolean>;

    create(model: T): Promise<Types.ObjectId>;

    delete(id: string): Promise<boolean>;

    getModel(): Model<T>;
}