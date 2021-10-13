import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { Project, ProjectType } from '../schemas/project.schema';

@Injectable()
export class ProjectRepository implements RepositoryInterface<ProjectType> {
    constructor(@InjectModel('Project') private model: Model<ProjectType>) {}

    public async findOne(query: FindQuery): Promise<Project> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find as FilterQuery<ProjectType>)
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async findOneRaw(query: FindQuery): Promise<Project> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find as FilterQuery<ProjectType>)
                .lean()
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<Project> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQuery): Promise<Project[]> {
        try {
            return await this.model
                .find((query?.find as FilterQuery<ProjectType>) || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(options: PaginationOptions): Promise<Project[]> {
        try {
            return await this.model
                .find((options.find as FilterQuery<ProjectType>) || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: Project): Promise<boolean> {
        try {
            const response: ProjectType = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: Project): Promise<Types.ObjectId> {
        try {
            const response: Project = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query): Promise<boolean> {
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

    public async deleteMany(query: FindQuery): Promise<boolean> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            const response: MongooseDeleteResponse =
                await this.model.deleteMany(
                    query.find as FilterQuery<ProjectType>,
                );

            return response.deletedCount > 0;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<ProjectType> {
        return this.model;
    }
}
