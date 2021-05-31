import { Inject } from 'typescript-ioc';
import { GetFeaturedProjectsCommandApi } from '../..';
import { ProjectInterface, ProjectRepository } from '../../../database';

export class GetFeaturedProjectsCommand implements GetFeaturedProjectsCommandApi{
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
            .populate('company')
            .populate({
                path: 'daoProposals',
                select: '-__v',
            })
            .populate('team')
            .populate({
                path: 'socialMedia',
                select: '-_id -__v',
            }).select('-__v');
    }
}
