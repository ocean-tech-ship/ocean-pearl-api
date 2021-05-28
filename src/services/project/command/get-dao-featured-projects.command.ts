import { Inject } from 'typescript-ioc';
import { ProjectInterface, ProjectRepository } from '../../../database';
import { DaoProposalStatusEnum } from '../../../database/enums/dao-proposal-status.enum';
import { GetDaoFeaturedProjectsCommandApi } from '../api/get-dao-featured-projects-comand.api';

export class GetDaoFeaturedProjectsCommand
    implements GetDaoFeaturedProjectsCommandApi
{
    projectRepository: ProjectRepository;

    constructor(
        @Inject
        projectRepository: ProjectRepository
    ) {
        this.projectRepository = projectRepository;
    }

    public async execute(): Promise<ProjectInterface[]> {
        const projectModel = this.projectRepository.getModel();

        return await projectModel
            .aggregate([
                {
                    $lookup: {
                        from: 'daoproposals',
                        let: {
                            id: '$_id',
                            status: DaoProposalStatusEnum.FundingRoundActive,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$project', '$$id'] },
                                            { $eq: ['$status', '$$status'] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'featuredDaoProposal',
                    },
                },
            ])
            .limit(2);
    }
}
