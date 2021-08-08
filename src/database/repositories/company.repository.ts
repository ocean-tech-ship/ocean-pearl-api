import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Company, CompanyType } from '../schemas/company.schema';

@Injectable()
export class CompanyRepository implements RepositoryInterface<CompanyType> {
    
    constructor(
        @InjectModel('Company') private model: Model<CompanyType>
    ) {}

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

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponse =
                await this.model.deleteOne({ id: id });

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<CompanyType> {
        return this.model;
    }
}
