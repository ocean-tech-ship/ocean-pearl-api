import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Company, { CompanyInterface, CompanyType } from '../model/company.model';

export class CompanyRepository implements RepositoryInterface<CompanyType> {
    private model: Model<CompanyType>;

    constructor() {
        this.model = Company;
    }

    public async getByID(id: Types.ObjectId): Promise<CompanyType> {
        try {
            return await this.model
                .findById(id)
                .populate({
                    path: 'address',
                    options: { lean: true },
                })
                .populate('jobs')
                .populate('projects')
                .populate({
                    path: 'socialMedia',
                    options: { lean: true },
                });
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<CompanyType[]> {
        try {
            return await this.model
                .find(query || {})
                .populate({
                    path: 'address',
                    options: { lean: true },
                })
                .populate('jobs')
                .populate('projects')
                .populate({
                    path: 'socialMedia',
                    options: { lean: true },
                });
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

    public async create(model: CompanyInterface): Promise<Types.ObjectId> {
        try {
            const response: CompanyInterface = await this.model.create(model);

            return response._id;
        } catch (error: any) {
            throw error;
        }
    }

    public async delete(id: Types.ObjectId): Promise<boolean> {
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
