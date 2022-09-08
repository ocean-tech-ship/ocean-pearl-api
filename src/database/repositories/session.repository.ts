import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Session, SessionType } from '../schemas/session.schema';

@Injectable()
export class SessionRepository implements RepositoryInterface<SessionType> {
    constructor(@InjectModel(Session.name) private model: Model<SessionType>) {}

    public async getByID(id: string): Promise<Session> {
        try {
            return await this.model.findOne({ _id: id }).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQuery<SessionType>): Promise<Session[]> {
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

    public async findOne(query: FindQuery<SessionType>): Promise<Session> {
        return this.findOneRaw(query);
    }

    public async findOneRaw(query: FindQuery<SessionType>): Promise<any> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    async update(model: Session, options: QueryOptions = null): Promise<boolean> {
        try {
            const response: SessionType = await this.model.findOneAndUpdate(
                {
                    walletAddress: model.walletAddress,
                    createdAt: model.createdAt,
                },
                model,
                options,
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Session): Promise<Types.ObjectId> {
        try {
            const response: Session = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery<SessionType>): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse = await this.model.deleteOne(query.find);

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteMany(query: FindQuery<SessionType>): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse = await this.model.deleteMany(query.find);

            return response.deletedCount > 0;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<SessionType> {
        return this.model;
    }
}
