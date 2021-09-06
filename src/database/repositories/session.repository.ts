import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Session, SessionType } from '../schemas/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { FindQuery } from '../interfaces/find-query.interface';

@Injectable()
export class SessionRepository implements RepositoryInterface<SessionType> {
    constructor(@InjectModel('Session') private model: Model<SessionType>) {}

    public async getByID(id: string): Promise<Session> {
        try {
            return await this.model.findOne({ _id: id }).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQuery): Promise<Session[]> {
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

    public async findOne(query: FindQuery): Promise<Session> {
        return this.findOneRaw(query);
    }

    public async findOneRaw(query: FindQuery): Promise<any> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteByWalletAddressAndCreatedAt(
        walletAddress: string,
        createdAt: Date,
    ): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse = await this.model.deleteOne(
                { walletAddress: walletAddress, createdAt: createdAt },
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    async update(model: Session): Promise<boolean> {
        try {
            const response: SessionType = await this.model.findOneAndUpdate(
                {
                    walletAddress: model.walletAddress,
                    createdAt: model.createdAt,
                },
                model,
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

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse = await this.model.deleteOne(
                { _id: id },
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteByWalletAddress(
        walletAddress: string,
    ): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse = await this.model.deleteMany(
                { walletAddress: walletAddress },
            );

            return response.deletedCount > 0;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<SessionType> {
        return this.model;
    }
}
