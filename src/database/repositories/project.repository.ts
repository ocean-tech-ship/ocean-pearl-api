import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryOptions, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { PaginateModel } from '../interfaces/paginate-model.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Project, ProjectType } from '../schemas/project.schema';

@Injectable()
export class ProjectRepository implements RepositoryInterface<ProjectType> {
    constructor(@InjectModel(Project.name) private model: PaginateModel<ProjectType>) {}

    public async findOne(query: FindQuery<ProjectType>): Promise<Project> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -airtableId',
                    populate: [
                        {
                            path: 'fundingRound',
                            model: 'Round',
                            select: '-_id -__v',
                        },
                        {
                            path: 'images',
                            model: 'Image',
                            select: '-_id -__v',
                        },
                    ],
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'logo',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'posts',
                    select: '-_id -__v',
                    options: {
                        sort: { updatedAt: -1 },
                    },
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async findOneRaw(query: FindQuery<ProjectType>): Promise<Project> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
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
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'logo',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'posts',
                    select: '-_id -__v',
                    options: {
                        sort: { updatedAt: -1 },
                    },
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQuery<ProjectType>): Promise<Project[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -airtableId',
                    populate: {
                        path: 'fundingRound',
                        model: 'Round',
                        select: '-_id -__v',
                    },
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'logo',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'posts',
                    select: '-_id -__v',
                    options: {
                        sort: { updatedAt: -1 },
                    },
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAllRaw(query?: FindQuery<ProjectType>): Promise<Project[]> {
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

    public async getPaginated(query: FindQuery<ProjectType>): Promise<PaginatedResponse<Project>> {
        try {
            return await this.model.paginate(query?.find || {}, {
                sort: query?.sort || {},
                limit: query?.limit || 0,
                page: query?.page || 0,
                populate: [
                    {
                        path: 'daoProposals',
                        select: '-project -_id -__v -deliverables -airtableId',
                        populate: {
                            path: 'fundingRound',
                            model: 'Round',
                            select: '-_id -__v',
                        },
                    },
                    {
                        path: 'images',
                        select: '-_id -__v',
                    },
                    {
                        path: 'logo',
                        select: '-_id -__v',
                    },
                    {
                        path: 'posts',
                        select: '-_id -__v',
                        options: {
                            sort: { updatedAt: -1 },
                        },
                    },
                ],
                select: '-_id -__v',
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async update(
        model: Project,
        options: QueryOptions = { strict: false },
    ): Promise<boolean> {
        try {
            const response: ProjectType = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
                options,
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

    public async delete(query: FindQuery<ProjectType>): Promise<boolean> {
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

    public async deleteMany(query: FindQuery<ProjectType>): Promise<boolean> {
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

    public getModel(): PaginateModel<ProjectType> {
        return this.model;
    }
}
