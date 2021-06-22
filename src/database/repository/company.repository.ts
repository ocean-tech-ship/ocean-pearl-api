import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Company, { CompanyInterface, CompanyType } from '../model/company.model';

export class CompanyRepository implements RepositoryInterface<CompanyType> {
    private model: Model<CompanyType>;

    constructor() {
        this.model = Company;
    }

    public async getByID(id: string): Promise<CompanyInterface> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate('jobs')
                .populate('projects');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<CompanyInterface[]> {
        try {
            return await this.model
                .find(query || {})
                .lean()
                .populate('jobs')
                .populate('projects');
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: CompanyInterface): Promise<boolean> {
        try {
            const response: CompanyInterface =
                await this.model.findOneAndUpdate({ id: model.id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: CompanyInterface): Promise<string> {
        try {
            const response: CompanyInterface = await this.model.create(model);

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

    public getModel(): Model<CompanyType> {
        return this.model;
    }
}
