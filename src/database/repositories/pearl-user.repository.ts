import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
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

    public async getByID(id: string): Promise<PearlUser> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<PearlUser[]> {
        try {
            return await this.model
                .find(query || {})
                .lean();
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
