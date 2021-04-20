import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Address, { AddressInterface } from '../model/address.model';

export class AddressRepository
    implements RepositoryInterface<AddressInterface> {
    private model: Model<AddressInterface>;

    constructor() {
        this.model = Address;
    }

    public async getByID(id: string): Promise<AddressInterface> {
        try {
            return await this.model.findById(id);
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<AddressInterface[]> {
        try {
            return await this.model.find(query || {});
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: AddressInterface): Promise<boolean> {
        try {
            const response: AddressInterface = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: AddressInterface): Promise<string> {
        try {
            const response: AddressInterface = await this.model.create(model);

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
