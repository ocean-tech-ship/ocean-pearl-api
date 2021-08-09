import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Job, JobType } from '../schemas/job.schema';

@Injectable()
export class JobRepository implements RepositoryInterface<JobType> {
    constructor(@InjectModel('Job') private model: Model<JobType>) {}

    public async findOne(query: FindQuery): Promise<Job> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .populate({
                    path: 'company',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<Job> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'company',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<Job[]> {
        try {
            return await this.model
                .find(query || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'company',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Job): Promise<boolean> {
        try {
            const response: Job = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Job): Promise<Types.ObjectId> {
        try {
            const response: Job = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse = await this.model.deleteOne(
                { id: id },
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<JobType> {
        return this.model;
    }
}
