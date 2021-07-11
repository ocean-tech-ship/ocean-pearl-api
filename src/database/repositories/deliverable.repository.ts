import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Deliverable, DeliverableType } from '../schemas/deliverable.schema';

@Injectable()
export class DeliverableRepository
    implements RepositoryInterface<DeliverableType> {
    constructor(
        @InjectModel('Deliverable') private model: Model<DeliverableType>,
    ) {}

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

    public async getAll(query?: FindQuery): Promise<Deliverable[]> {
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

    public async update(model: Deliverable): Promise<boolean> {
        try {
            const response: Deliverable = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
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

    public getModel(): Model<DeliverableType> {
        return this.model;
    }
}
