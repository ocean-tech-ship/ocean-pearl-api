import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
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
                    options: { lean: true },
                })
                .populate({
                    path: 'kpiTargets',
                    options: { lean: true },
                });
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<DaoProposalType[]> {
        try {
            return await this.model
                .find(query || {})
                .populate('project')
                .populate({
                    path: 'deliverables',
                    options: { lean: true },
                })
                .populate({
                    path: 'kpiTargets',
                    options: { lean: true },
                });
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        page: number,
        limit: number,
        query?: FilterQuery<any>
    ): Promise<DaoProposalType[]> {
        try {
            return await this.model
                .find(query || {})
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('project')
                .populate({
                    path: 'deliverables',
                    options: { lean: true },
                })
                .populate({
                    path: 'kpiTargets',
                    options: { lean: true },
                });
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
