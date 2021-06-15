import { Model, Types } from 'mongoose';
import { FindQueryInterface } from '../interfaces/find-query.interface';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptionsInterface } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import DaoProposal, {
    DaoProposalInterface,
    DaoProposalType,
} from '../model/dao-proposal.model';

export class DaoProposalRepository
    implements RepositoryInterface<DaoProposalType>
{
    private model: Model<DaoProposalType>;

    constructor() {
        this.model = DaoProposal;
    }

    public async getByID(id: Types.ObjectId): Promise<DaoProposalType> {
        try {
            return await this.model
                .findById(id)
                .populate('project')
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(
        query?: FindQueryInterface
    ): Promise<DaoProposalType[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .populate('project')
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        options: PaginationOptionsInterface
    ): Promise<DaoProposalType[]> {
        try {
            return await this.model
                .find(options.find || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .populate('project')
                .populate({
                    path: 'deliverables',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'kpiTargets',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: DaoProposalInterface): Promise<boolean> {
        try {
            const response: DaoProposalInterface =
                await this.model.findOneAndUpdate({ _id: model._id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: DaoProposalInterface): Promise<Types.ObjectId> {
        try {
            const response: DaoProposalInterface = await this.model.create(
                model
            );

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: Types.ObjectId): Promise<boolean> {
        try {
            const response: MongooseDeleteResponseInterface =
                await this.model.deleteOne({ _id: id });

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<DaoProposalType> {
        return this.model;
    }
}
