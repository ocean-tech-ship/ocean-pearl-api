import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { StrategyInterface } from '../interfaces/strategy.interface';
import { ProjectMapper } from '../mapper/project.mapper';

@Injectable()
export class SingleMissmatchedProposalStrategy implements StrategyInterface {
    public constructor(
        private proposalRepository: DaoProposalRepository,
        private projectRepository: ProjectRepository,
        private projectMapper: ProjectMapper,
    ) {}

    public async canHandle(
        project: Project,
        proposal: DaoProposal,
    ): Promise<boolean> {
        return (
            project === null && proposal !== null && proposal.project !== null
        );
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
        oldProject.daoProposals = oldProject.daoProposals as Types.ObjectId[];

        for (const [
            index,
            linkedProposalId,
        ] of oldProject.daoProposals.entries()) {
            const linkedProposal = await this.proposalRepository.findOneRaw({
                find: { _id: linkedProposalId },
            });

            if (linkedProposal.airtableId !== proposal.airtableId) {
                oldProject.daoProposals.splice(index, 1);
            }
        }

        if (oldProject.daoProposals.length === 0) {
            await this.projectRepository.delete(oldProject.id);
        } else {
            await this.projectRepository.update(oldProject);
        }

        const newProject: Project = this.projectMapper.map(airtableData);

        newProject.daoProposals = newProject.daoProposals as Types.ObjectId[];
        newProject.daoProposals.push(proposal._id);
        newProject.logo = oldProject.logo;
        newProject.pictures = oldProject.pictures;
        newProject.description = oldProject.description;

        newProposal.project = await this.projectRepository.create(newProject);
        newProposal.id = proposal.id;
        proposal.deliverables = proposal.deliverables as Types.ObjectId[];
        newProposal.deliverables = proposal.deliverables;

        await this.proposalRepository.update(newProposal);
    }
}
