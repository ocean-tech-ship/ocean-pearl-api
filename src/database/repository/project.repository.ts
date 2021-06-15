import { Model, Types } from 'mongoose';
import { FindQueryInterface } from '../interfaces/find-query.interface';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptionsInterface } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Project, { ProjectInterface, ProjectType } from '../model/project.model';

export class ProjectRepository implements RepositoryInterface<ProjectType> {
    private model: Model<ProjectType>;

    constructor() {
        this.model = Project;
    }

    public async getByID(id: Types.ObjectId): Promise<ProjectType> {
        try {
            return await this.model
                .findById(id)
                .populate('company')
                .populate('daoProposals')
                .populate('team')
                .populate({
                    path: 'address',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'socialMedia',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FindQueryInterface): Promise<ProjectType[]> {
        try {
            return await this.model
                .find(query?.find || {})
                .sort(query?.sort || {})
                .populate('company')
                .populate('daoProposals')
                .populate('team')
                .populate({
                    path: 'address',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'socialMedia',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        options: PaginationOptionsInterface
    ): Promise<ProjectType[]> {
        try {
            return await this.model
                .find(options.find || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .populate('company')
                .populate('daoProposals')
                .populate('team')
                .populate({
                    path: 'address',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'socialMedia',
                    select: '-_id -__v',
                })
                .select('-__v');
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: ProjectInterface): Promise<boolean> {
        try {
            const response: ProjectType = await this.model.findOneAndUpdate(
                { _id: model._id },
                model
            );

            return response !== null;
        } catch (error: any) {
            throw error;
        }
    }

    public async create(model: ProjectInterface): Promise<Types.ObjectId> {
        try {
            const response: ProjectInterface = await this.model.create(model);

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

    public getModel(): Model<ProjectType> {
        return this.model;
    }
}
