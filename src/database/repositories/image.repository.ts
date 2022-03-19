import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Image, ImageType } from '../schemas/image.schema';

@Injectable()
export class ImageRepository
    implements RepositoryInterface<ImageType>
{
    constructor(
        @InjectModel('Image') private model: Model<ImageType>,
    ) {}

    public async findOne(
        query: FindQuery<ImageType>,
    ): Promise<Image> {
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
        query: FindQuery<ImageType>,
    ): Promise<Image> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<Image> {
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
        query?: FindQuery<ImageType>,
    ): Promise<Image[]> {
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

    public async getAllRaw(
        query?: FindQuery<ImageType>,
    ): Promise<Image[]> {
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

    public async update(model: Image): Promise<boolean> {
        try {
            const response: Image = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Image): Promise<Types.ObjectId> {
        try {
            const response: Image = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery<ImageType>): Promise<boolean> {
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
        query: FindQuery<ImageType>,
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

    public getModel(): Model<ImageType> {
        return this.model;
    }
}
