import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { StrategyInterface } from '../interfaces/strategy.interface';

@Injectable()
export class MissmatchedProposalStrategy implements StrategyInterface {
    public constructor(
        private proposalRepository: DaoProposalRepository,
        private projectRepository: ProjectRepository,
    ) {}

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
                return false;
            }
        }

        return true;
    }

    public async execute(
        project: Project,
        proposal: DaoProposal,
        newProposal: DaoProposal,
        airtableData: any,
    ): Promise<void> {
        const oldProject = await this.projectRepository.findOneRaw({
            find: { _id: proposal.project },
        });

        if (oldProject) {
            oldProject.daoProposals = oldProject.daoProposals as Types.ObjectId[];

            for (const [
                index,
                linkedProposalId,
            ] of oldProject.daoProposals.entries()) {
                const linkedProposal = await this.proposalRepository.findOneRaw(
                    {
                        find: { _id: linkedProposalId },
                    },
                );

                if (linkedProposal.airtableId === proposal.airtableId) {
                    oldProject.daoProposals.splice(index, 1);
                }
            }

            if (oldProject.daoProposals.length === 0) {
                await this.projectRepository.delete({
                    find: { id: oldProject.id },
                });
            } else {
                await this.projectRepository.update(oldProject);
            }
        }

        newProposal._id = proposal._id;
        newProposal.id = proposal.id;
        proposal.deliverables = proposal.deliverables as Types.ObjectId[];
        newProposal.deliverables = proposal.deliverables;
        newProposal.project = project._id;
        await this.proposalRepository.update(newProposal);

        project.daoProposals = project.daoProposals as Types.ObjectId[];
        project.daoProposals.push(newProposal._id);
        await this.projectRepository.update(project);
    }
}
