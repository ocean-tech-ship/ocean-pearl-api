import { Inject } from 'typescript-ioc';
import { GetFeaturedProjectsCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';

export class GetFeaturedProjectsCommand
    implements GetFeaturedProjectsCommandApi
{
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(): Promise<ProjectInterface[]> {
        const model = this.projectRepository.getModel();

        return await model
            .find()
            .sort({ createdAt: -1 })
            .limit(4)
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
    }
}
