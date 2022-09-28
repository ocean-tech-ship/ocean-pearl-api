import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Round, RoundType } from '../schemas/round.schema';

@Injectable()
export class RoundRepository implements RepositoryInterface<RoundType> {
    constructor(@InjectModel(Round.name) private model: Model<RoundType>) {}

    public async findOne(query: FindQuery<RoundType>): Promise<Round> {
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

    public async findOneRaw(query: FindQuery<RoundType>): Promise<Round> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<Round> {
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

    public async getAll(query?: FindQuery<RoundType>): Promise<Round[]> {
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

    public async getAllRaw(query?: FindQuery<RoundType>): Promise<Round[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Round, options: QueryOptions = null): Promise<boolean> {
        try {
            const response: Round = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
                options
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Round): Promise<Types.ObjectId> {
        try {
            const response: Round = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery<RoundType>): Promise<boolean> {
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

    public async deleteMany(query: FindQuery<RoundType>): Promise<boolean> {
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

    public getModel(): Model<RoundType> {
        return this.model;
    }
}
