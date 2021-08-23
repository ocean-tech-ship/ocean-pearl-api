import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Session, SessionType } from '../schemas/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';

@Injectable()
export class SessionRepository implements RepositoryInterface<SessionType> {
    constructor(@InjectModel('Session') private model: Model<SessionType>) {}

    public async getByWalletAddress(walletAddress: string): Promise<Session[]> {
        try {
            return await this.model
                .find({ walletAddress: walletAddress })
                .lean()
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByWalletAddressAndHashedToken(
        walletAddress: string,
        hashedToken: string,
    ): Promise<Session> {
        try {
            return await this.model
                .findOne({
                    walletAddress: walletAddress,
                    hashedToken: hashedToken,
                })
                .lean()
                .exec();
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

    public async deleteSession(
        walletAddress: string,
        hashedToken: string,
    ): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse = await this.model.deleteOne(
                { walletAddress: walletAddress, hashedToken: hashedToken },
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    getByID(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    update(model: Session): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async create(model: Session): Promise<Types.ObjectId> {
        try {
            const response: Session = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    getAll(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }

    public getModel(): Model<SessionType> {
        return this.model;
    }
}
