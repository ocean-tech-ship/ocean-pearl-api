import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Round, RoundType } from '../schemas/round.schema';

@Injectable()
export class RoundRepository implements RepositoryInterface<RoundType> {

    constructor(
        @InjectModel('Round') private model: Model<RoundType>
    ) {}

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

    public async getAll(
        query?: FindQuery
    ): Promise<Round[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        options: PaginationOptions
    ): Promise<Round[]> {
        try {
            return await this.model
                .find(options.find || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .lean()
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Round): Promise<boolean> {
        try {
            const response: Round = await this.model.findOneAndUpdate(
                { id: model.id },
                model
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

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse =
                await this.model.deleteOne({ id: id });

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<RoundType> {
        return this.model;
    }
}