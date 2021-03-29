import { Document, FilterQuery, Model } from "mongoose";
import { RepositoryInterface } from "./repository.inteface";

export class AbstractRepository<T extends Document> implements RepositoryInterface<T> {

    private model: Model<Document>;

    constructor(model: Model<Document>) {
        this.model = model;
    }

    public async getByID(id: string): Promise<T> {
        let model: T;

        await this.model.findById(id)
        .then((response: T) => {
            model = response;
        }).catch((error: Error) => {
            throw error;
        });
    
        return model;
    }

    public async getAll(query?: FilterQuery<any>): Promise<T[]> {
        let entries: T[];

        await this.model.find(query || {})
        .then((response: T[]) => {
            entries = response;
        }).catch((error: Error) => {
            throw error;
        });

        return entries;
    }

    public async update(model: T): Promise<boolean> {
        let response: boolean = false;

        await this.model.findOneAndUpdate(
            {_id: model._id},
            model
        ).then(() => {
            response = true;
        }).catch((error: Error) => {
            throw error;
        });

        return response;
    }

    public async create(model: T): Promise<boolean> {
        let response: boolean = false;

        await this.model.create(model)
        .then(() => {
            response = true;
        }).catch((error: Error) => {
            throw error;
        });

        return response;
    }

    public async delete(id: string): Promise<boolean> {
        let response: boolean = false;
        
        await this.model.deleteOne({'_id': id})
        .then(() => {
            response = true;
        }).catch((error: Error) => {
            throw error
        });

        return response;
    }
}