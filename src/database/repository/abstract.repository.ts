import { Document, FilterQuery, Model } from "mongoose";
import { MongooseDeleteResponseInterface } from "../interfaces/mongoose-delete-response.interface";
import { RepositoryInterface } from "../interfaces/repository.inteface";

export abstract class AbstractRepository<T extends Document>
    implements RepositoryInterface<T> {
        
    private model: Model<Document>;

    constructor(model: Model<Document>) {
        this.model = model;
    }

    public async getByID(id: string): Promise<T> {

        try {
            return await this.model.findById(id) as T;
        } catch (error: any) {

            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<T[]> {

        try {
            return await this.model.find(query || {}) as T[];
        } catch (error: any) {

            throw error;
        }
    }

    public async update(model: T): Promise<boolean> {

        try {
            const response: T = await this.model.findOneAndUpdate({ _id: model._id }, model) as T;

            return response !== null;
        } catch (error: any) {

            throw error;
        }
    }

    public async create(model: T): Promise<boolean> {

        try {
            const response: T = await this.model.create(model) as T;

            return response !== null;
        } catch (error: any) {

            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {

        try {
            const response: MongooseDeleteResponseInterface = await this.model.deleteOne({ _id: id });

            return response.deletedCount === 1;
        } catch (error: any) {

            throw error;
        }
    }
}
