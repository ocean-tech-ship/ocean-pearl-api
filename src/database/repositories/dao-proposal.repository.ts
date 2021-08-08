import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindQuery } from '../interfaces/find-query.interface';
import { MongooseDeleteResponse } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptions } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import { DaoProposal, DaoProposalType } from '../schemas/dao-proposal.schema';

@Injectable()
export class DaoProposalRepository
    implements RepositoryInterface<DaoProposalType> {
    constructor(
        @InjectModel('DaoProposal') private model: Model<DaoProposalType>,
    ) {}

    public async getByID(id: string): Promise<DaoProposal> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
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

    public async getAll(query?: FindQuery): Promise<DaoProposal[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .limit(query?.limit || 0)
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
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
        options: PaginationOptions,
    ): Promise<DaoProposal[]> {
        try {
            return await this.model
                .find(options.find || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .lean()
                .populate({
                    path: 'project',
                    select: '-daoProposals -_id -__v',
                })
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
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

    public async update(model: DaoProposal): Promise<boolean> {
        try {
            const response: DaoProposal = await this.model.findOneAndUpdate(
                { id: model.id },
                model,
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

    public getModel(): Model<DaoProposalType> {
        return this.model;
    }
}
