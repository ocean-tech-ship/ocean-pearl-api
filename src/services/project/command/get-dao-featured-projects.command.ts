import { Inject } from 'typescript-ioc';
import { ProjectInterface, ProjectRepository } from '../../../database';
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
                            fundingRound: 6,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$project', '$$id'] },
                                            {
                                                $eq: [
                                                    '$fundingRound',
                                                    '$$fundingRound',
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    __v: 0,
                                    _id: 0,
                                    project: 0,
                                    deliverables: 0,
                                    kpiTargets: 0,
                                },
                            },
                        ],
                        as: 'featuredDaoProposal',
                    },
                },
                {
                    $lookup: {
                        from: 'daoproposals',
                        let: {
                            id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$project', '$$id'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    __v: 0,
                                    _id: 0,
                                    project: 0,
                                    deliverables: 0,
                                    kpiTargets: 0,
                                },
                            },
                        ],
                        as: 'daoProposals',
                    },
                },
                { $match: { 'featuredDaoProposal.fundingRound': { $eq: 6 } } },
                { $match: { 'featured': { $eq: true } } },
                { $project: { __v: 0, _id: 0 } },
            ])
            .limit(2);
    }
}
