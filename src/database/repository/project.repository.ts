import { FilterQuery, Model } from 'mongoose';
import { MongooseDeleteResponseInterface } from '../interfaces/mongoose-delete-response.interface';
import { PaginationOptionsInterface } from '../interfaces/pagination-options.interface';
import { RepositoryInterface } from '../interfaces/repository.inteface';
import Project, { ProjectInterface, ProjectType } from '../model/project.model';

export class ProjectRepository implements RepositoryInterface<ProjectType> {
    private model: Model<ProjectType>;

    constructor() {
        this.model = Project;
    }

    public async getByID(id: string): Promise<ProjectInterface> {
        try {
            return await this.model
                .findOne({ id: id })
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets',
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAll(query?: FilterQuery<any>): Promise<ProjectInterface[]> {
        try {
            return await this.model
                .find(query || {})
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets',
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async getPaginated(
        options: PaginationOptionsInterface
    ): Promise<ProjectInterface[]> {
        try {
            return await this.model
                .find(options.find || {})
                .sort(options.sort || {})
                .skip((options.page - 1) * options.limit)
                .limit(options.limit)
                .lean()
                .populate({
                    path: 'company',
                    select: '-_id -__v',
                })
                .populate({
                    path: 'daoProposals',
                    select: '-project -_id -__v -deliverables -kpiTargets',
                })
                .populate({
                    path: 'team',
                    select: '-_id -__v',
                })
                .select('-_id -__v -socialMedia._id -address._id')
                .exec();
        } catch (error: any) {
            throw error;
        }
    }

    public async update(model: ProjectInterface): Promise<boolean> {
        try {
            const response: ProjectType = await this.model.findOneAndUpdate(
                { id: model.id },
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

    public getModel(): Model<ProjectType> {
        return this.model;
    }
}
