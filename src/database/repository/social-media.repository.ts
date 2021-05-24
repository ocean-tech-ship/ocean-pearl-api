import { FilterQuery, Model, Types } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import SocialMedia, {
    SocialMediaInterface,
    SocialMediaType,
} from '../model/social-media.model';

export class SocialMediaRepository
    implements RepositoryInterface<SocialMediaType>
{
    private model: Model<SocialMediaType>;

    constructor() {
        this.model = SocialMedia;
    }

    public async getByID(id: Types.ObjectId): Promise<SocialMediaType> {
        try {
            return await this.model.findById(id);
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<SocialMediaType[]> {
        try {
            return await this.model.find(query || {});
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: SocialMediaInterface): Promise<boolean> {
        try {
            const response: SocialMediaInterface =
                await this.model.findOneAndUpdate({ _id: model._id }, model);

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: SocialMediaInterface): Promise<Types.ObjectId> {
        try {
            const response: SocialMediaInterface = await this.model.create(
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

    public getModel(): Model<SocialMediaType> {
        return this.model;
    }
}
