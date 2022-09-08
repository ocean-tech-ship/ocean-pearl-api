import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Deliverable, DeliverableType } from '../schemas/deliverable.schema';

@Injectable()
export class DeliverableRepository
    implements RepositoryInterface<DeliverableType>
{
    constructor(
        @InjectModel(Deliverable.name) private model: Model<DeliverableType>,
    ) {}

    public async findOne(
        query: FindQuery<DeliverableType>,
    ): Promise<Deliverable> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async findOneRaw(
        query: FindQuery<DeliverableType>,
    ): Promise<Deliverable> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<Deliverable> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(
        query?: FindQuery<DeliverableType>,
    ): Promise<Deliverable[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Deliverable, options: QueryOptions = null): Promise<boolean> {
        try {
            const response: Deliverable = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
                options
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Deliverable): Promise<Types.ObjectId> {
        try {
            const response: Deliverable = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery<DeliverableType>): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse = await this.model.deleteOne(
                query.find,
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteMany(
        query: FindQuery<DeliverableType>,
    ): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse =
                await this.model.deleteMany(query.find);

            return response.deletedCount > 0;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<DeliverableType> {
        return this.model;
    }
}
