import { Model } from 'mongoose';
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

    public async getByID(id: string): Promise<DaoProposalInterface> {
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
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(
        query?: FindQueryInterface
    ): Promise<DaoProposalInterface[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
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
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        options: PaginationOptionsInterface
    ): Promise<DaoProposalInterface[]> {
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
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: DaoProposalInterface): Promise<boolean> {
        try {
            const response: DaoProposalInterface =
                await this.model.findOneAndUpdate({ id: model.id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: DaoProposalInterface): Promise<string> {
        try {
            const response: DaoProposalInterface = await this.model.create(
                model
            );

            return response.id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponseInterface =
                await this.model.deleteOne({ id: id });

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }

    public getModel(): Model<DaoProposalType> {
        return this.model;
    }
}
