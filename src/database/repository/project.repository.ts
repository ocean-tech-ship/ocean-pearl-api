import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Project, { ProjectInterface } from '../model/project.model';

export class ProjectRepository
    implements RepositoryInterface<ProjectInterface> {
    private model: Model<ProjectInterface>;

    constructor() {
        this.model = Project;
    }

    public async getByID(id: string): Promise<ProjectInterface> {
        try {
            return await this.model
                .findById(id)
                .populate('company')
                .populate('daoProposals')
                .populate('socialMedia');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<ProjectInterface[]> {
        try {
            return await this.model
                .find(query || {})
                .populate('company')
                .populate('daoProposals')
                .populate('socialMedia');
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(): Promise<ProjectInterface[]> {
        try {

            return 
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: ProjectInterface): Promise<boolean> {
        try {
            const response: ProjectInterface = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: ProjectInterface): Promise<string> {
        try {
            const response: ProjectInterface = await this.model.create(model);

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
