import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Job, { JobInterface } from '../model/job.model';

export class JobRepository implements RepositoryInterface<JobInterface> {
    private model: Model<JobInterface>;

    constructor() {
        this.model = Job;
    }

    public async getByID(id: string): Promise<JobInterface> {
        try {
            return await this.model.findById(id).populate('company');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<JobInterface[]> {
        try {
            return await this.model.find(query || {}).populate('company');
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: JobInterface): Promise<boolean> {
        try {
            const response: JobInterface = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: JobInterface): Promise<string> {
        try {
            const response: JobInterface = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponseInterface = await this.model.deleteOne(
                { _id: id }
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }
}
