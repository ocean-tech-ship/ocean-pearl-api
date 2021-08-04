import { Injectable } from '@nestjs/common';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetLatestDaoProposalsService
{
    constructor(
        private daoProposalRepository: DaoProposalRepository
    ) {}

    public async execute(): Promise<DaoProposal[]> {
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
