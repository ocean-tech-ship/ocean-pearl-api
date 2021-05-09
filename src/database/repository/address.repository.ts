import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Address, { AddressInterface, AddressType } from '../model/address.model';

export class AddressRepository
    implements RepositoryInterface<AddressType> {
    private model: Model<AddressType>;

    constructor() {
        this.model = Address;
    }

    public async getByID(id: Types.ObjectId): Promise<AddressType> {
        try {
            return await this.model.findById(id);
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<AddressType[]> {
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

    public async create(model: AddressInterface): Promise<Types.ObjectId> {
        try {
            const response: AddressInterface = await this.model.create(model);

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
