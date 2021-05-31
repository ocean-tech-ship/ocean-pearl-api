import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import OceanUser, {
    OceanUserInterface,
    OceanUserType,
} from '../model/ocean-user.model';

export class OceanUserRepository implements RepositoryInterface<OceanUserType> {
    private model: Model<OceanUserType>;

    constructor() {
        this.model = OceanUser;
    }

    public async getByID(id: Types.ObjectId): Promise<OceanUserType> {
        try {
            return await this.model.findById(id).populate({
                path: 'address',
                select: '-_id -__v',
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<OceanUserType[]> {
        try {
            return await this.model.find(query || {}).populate({
                path: 'address',
                select: '-_id -__v',
            });
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: OceanUserInterface): Promise<boolean> {
        try {
            const response: OceanUserInterface =
                await this.model.findOneAndUpdate({ _id: model._id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: OceanUserInterface): Promise<Types.ObjectId> {
        try {
            const response: OceanUserInterface = await this.model.create(model);

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

    public getModel(): Model<OceanUserType> {
        return this.model;
    }
}
