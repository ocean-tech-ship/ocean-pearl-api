import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class FeaturedProjectsService
{

    constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(): Promise<Project[]> {
        const model = this.projectRepository.getModel();

        return await model
            .find()
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
            .populate({
                path: 'daoProposals',
                select: '-project -_id -__v -deliverables',
            })
            .select('-_id -__v')
            .exec();
    }
}
