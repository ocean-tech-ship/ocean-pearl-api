import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Company, CompanyType } from '../schemas/company.schema';

@Injectable()
export class CompanyRepository implements RepositoryInterface<CompanyType> {
    
    constructor(
        @InjectModel('Company') private model: Model<CompanyType>
    ) {}

    public async findOne(query: FindQuery): Promise<Company> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .populate({
                    path: 'jobs',
                    select: 'id',
                })
                .populate({
                    path: 'projects',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async findOneRaw(query: FindQuery): Promise<Company> {
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

    public async getByID(id: string): Promise<Company> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'jobs',
                    select: 'id',
                })
                .populate({
                    path: 'projects',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<Company[]> {
        try {
            return await this.model
                .find(query || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'jobs',
                    select: 'id',
                })
                .populate({
                    path: 'projects',
                    select: 'id',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Company): Promise<boolean> {
        try {
            const response: Company =
                await this.model.findOneAndUpdate({ id: model.id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Company): Promise<Types.ObjectId> {
        try {
            const response: Company = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse =
                await this.model.deleteOne(query.find);

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteMany(query: FindQuery): Promise<boolean> {
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

    public getModel(): Model<CompanyType> {
        return this.model;
    }
}
