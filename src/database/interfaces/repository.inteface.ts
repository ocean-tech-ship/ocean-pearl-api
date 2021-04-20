import { Document } from "mongoose";

export interface RepositoryInterface<T extends Document> {
    getByID(id: string): Promise<T>;

    getAll(): Promise<T[]>;

    update(model: T): Promise<boolean>;

    create(model: T): Promise<string>;

    delete(id: string): Promise<boolean>;
}