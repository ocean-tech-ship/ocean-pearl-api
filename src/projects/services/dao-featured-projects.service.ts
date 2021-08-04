import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class DaoFeaturedProjectsService
{
    constructor(
        private projectRepository: ProjectRepository
    ) {}

    public async execute(): Promise<Project[]> {
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
