import { FilterQuery, Model } from 'mongoose';
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

    public async getByID(id: string): Promise<OceanUserInterface> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<OceanUserInterface[]> {
        try {
            return await this.model
                .find(query || {})
                .lean();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: OceanUserInterface): Promise<boolean> {
        try {
            const response: OceanUserInterface =
                await this.model.findOneAndUpdate({ id: model.id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: OceanUserInterface): Promise<string> {
        try {
            const response: OceanUserInterface = await this.model.create(model);

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

    public getModel(): Model<OceanUserType> {
        return this.model;
    }
}
