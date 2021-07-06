import { Inject } from 'typescript-ioc';
import { DaoProposalInterface, DaoProposalRepository } from '../../../database';
import { GetLatestDaoProposalsCommandApi } from '../api/get-latest-dao-proposal-command.api';

export class GetLatestDaoProposalsCommand
    implements GetLatestDaoProposalsCommandApi
{
    daoProposalRepository: DaoProposalRepository;

    constructor(
        @Inject
        daoProposalRepository: DaoProposalRepository
    ) {
        this.daoProposalRepository = daoProposalRepository;
    }

    public async execute(): Promise<DaoProposalInterface[]> {
        return await this.daoProposalRepository
            .getModel()
            .find()
            .sort({ fundingRound: -1 })
            .limit(4)
            .lean()
            .populate({
                path: 'project',
                select: '-daoProposals -_id -__v',
            })
            .populate({
                path: 'deliverables',
                select: '-_id -__v',
            })
            .populate({
                path: 'kpiTargets',
                select: '-_id -__v',
            })
            .select('-_id -__v')
            .exec();
    }
}
