import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import {
    PearlUser,
    PearlUserType,
} from '../schemas/pearl-user.schema';

@Injectable()
export class PearlUserRepository implements RepositoryInterface<PearlUserType> {

    constructor(
        @InjectModel('PearlUser') private model: Model<PearlUserType>
    ) {}

    public async findOne(query: FindQuery): Promise<PearlUser> {
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

    public async findOneRaw(query: FindQuery): Promise<PearlUser> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<PearlUser> {
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

    public async getAll(query?: FilterQuery<any>): Promise<PearlUser[]> {
        try {
            return await this.model
                .find(query || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: PearlUser): Promise<boolean> {
        try {
            const response: PearlUser =
                await this.model.findOneAndUpdate({ id: model.id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: PearlUser): Promise<Types.ObjectId> {
        try {
            const response: PearlUser = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse =
                await this.model.deleteOne({ id: id });

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<PearlUserType> {
        return this.model;
    }
}
