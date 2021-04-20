import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import DaoProposal, { DaoProposalInterface } from '../model/dao-proposal.model';

export class DaoProposalRepository
    implements RepositoryInterface<DaoProposalInterface> {
    private model: Model<DaoProposalInterface>;

    constructor() {
        this.model = DaoProposal;
    }

    public async getByID(id: string): Promise<DaoProposalInterface> {
        try {
            return await this.model
                .findById(id)
                .populate('project');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(
        query?: FilterQuery<any>
    ): Promise<DaoProposalInterface[]> {
        try {
            return await this.model
                .find(query || {})
                .populate('project');
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: DaoProposalInterface): Promise<boolean> {
        try {
            const response: DaoProposalInterface = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

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

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: string): Promise<boolean> {
        try {
            const response: MongooseDeleteResponseInterface = await this.model.deleteOne(
                { _id: id }
            );

            return response.deletedCount === 1;
        } catch (error: any) {
            throw error;
        }
    }
}
