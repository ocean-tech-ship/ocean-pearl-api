import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { StrategyInterface } from '../interfaces/strategy.interface';

@Injectable()
export class UpdateProposalStrategy implements StrategyInterface {
    public constructor(private proposalRepository: DaoProposalRepository) {}

    public async canHandle(
        project: Project,
        proposal: DaoProposal,
    ): Promise<boolean> {
        if (project === null || proposal === null) {
            return false;
        }

        for (const proposalId of project.daoProposals) {
            const databaseProposal: DaoProposal = await this.proposalRepository.findOneRaw(
                { find: { _id: proposalId } },
            );

            if (databaseProposal.airtableId === proposal.airtableId) {
                return true;
            }
        }

        return false;
    }

    public async execute(
        project: Project,
        proposal: DaoProposal,
        newProposal: DaoProposal,
        airtableData: any,
    ): Promise<void> {
        newProposal.id = proposal.id;
        newProposal.project = project._id;

        proposal.deliverables = proposal.deliverables as Types.ObjectId[];
        newProposal.deliverables = proposal.deliverables;

        await this.proposalRepository.update(newProposal);
    }
}
