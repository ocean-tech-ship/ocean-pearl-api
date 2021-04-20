import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Company, { CompanyInterface } from '../model/company.model';

export class CompanyRepository
    implements RepositoryInterface<CompanyInterface> {
    private model: Model<CompanyInterface>;

    constructor() {
        this.model = Company;
    }

    public async getByID(id: string): Promise<CompanyInterface> {
        try {
            return (await this.model
                .findById(id)
                .populate('address')
                .populate('jobs')
                .populate('projects')
                .populate('socialMedia')) as CompanyInterface;
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<CompanyInterface[]> {
        try {
            return (await this.model
                .find(query || {})
                .populate('address')
                .populate('jobs')
                .populate('projects')
                .populate('socialMedia')) as CompanyInterface[];
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: CompanyInterface): Promise<boolean> {
        try {
            const response: CompanyInterface = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: CompanyInterface): Promise<string> {
        try {
            const response: CompanyInterface = await this.model.create(model);

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
