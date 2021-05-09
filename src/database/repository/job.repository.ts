import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Job, { JobInterface, JobType } from '../model/job.model';

export class JobRepository implements RepositoryInterface<JobType> {
    private model: Model<JobType>;

    constructor() {
        this.model = Job;
    }

    public async getByID(id: Types.ObjectId): Promise<JobType> {
        try {
            return await this.model.findById(id).populate('company');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<JobType[]> {
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

    public async create(model: JobInterface): Promise<Types.ObjectId> {
        try {
            const response: JobInterface = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: Types.ObjectId): Promise<boolean> {
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
