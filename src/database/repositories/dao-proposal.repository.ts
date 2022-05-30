import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryOptions, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { PaginateModel } from '../interfaces/paginate-model.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { PaginatedResponse } from '../models/paginated-response.model';
import { DaoProposal, DaoProposalType } from '../schemas/dao-proposal.schema';

@Injectable()
export class DaoProposalRepository implements RepositoryInterface<DaoProposalType> {
    constructor(
        @InjectModel('DaoProposal')
        private model: PaginateModel<DaoProposalType>,
    ) {}

    public async findOne(query: FindQuery<DaoProposalType>): Promise<DaoProposal> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model
                .findOne(query.find)
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                    populate: [
                        {
                            path: 'logo',
                            select: '-_id -__v',
                        },
                        {
                            path: 'images',
                            select: '-_id -__v',
                        },
                    ],
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'fundingRound',
                    select: '-_id -__v',
                })
                .select('-_id -__v -airtableId')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async findOneRaw(query: FindQuery<DaoProposalType>): Promise<DaoProposal> {
        try {
            if (!query || !query?.find) {
                throw new Error('Please specify a query');
            }

            return await this.model.findOne(query.find).lean().exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getByID(id: string): Promise<DaoProposal> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                    populate: [
                        {
                            path: 'logo',
                            select: '-_id -__v',
                        },
                        {
                            path: 'images',
                            select: '-_id -__v',
                        },
                    ],
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'fundingRound',
                    select: '-_id -__v',
                })
                .select('-_id -__v -airtableId')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQuery<DaoProposalType>): Promise<DaoProposal[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                    populate: [
                        {
                            path: 'logo',
                            select: '-_id -__v',
                        },
                        {
                            path: 'images',
                            select: '-_id -__v',
                        },
                    ],
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'images',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'fundingRound',
                    select: '-_id -__v',
                })
                .select('-_id -__v -airtableId')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        query?: FindQuery<DaoProposalType>,
    ): Promise<PaginatedResponse<DaoProposal>> {
        try {
            return await this.model.paginate(query?.find || {}, {
                sort: query?.sort || {},
                limit: query?.limit || 0,
                page: query?.page || 0,
                populate: [
                    {
                        path: 'project',
                        select: '-daoProposals -_id -__v',
                        populate: [
                            {
                                path: 'logo',
                                select: '-_id -__v',
                            },
                            {
                                path: 'images',
                                select: '-_id -__v',
                            },
                        ],
                    },
                    {
                        path: 'deliverables',
                        select: '-_id -__v',
                    },
                    {
                        path: 'images',
                        select: '-_id -__v',
                    },
                    {
                        path: 'fundingRound',
                        select: '-_id -__v',
                    },
                ],
                select: '-_id -__v -airtableId',
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: DaoProposal, options: QueryOptions = null): Promise<boolean> {
        try {
            const response: DaoProposal = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
                options,
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: DaoProposal): Promise<Types.ObjectId> {
        try {
            const response: DaoProposal = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(query: FindQuery<DaoProposalType>): Promise<boolean> {
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

    public async deleteMany(query: FindQuery<DaoProposalType>): Promise<boolean> {
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

    public getModel(): PaginateModel<DaoProposalType> {
        return this.model;
    }
}
