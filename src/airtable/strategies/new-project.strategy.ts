import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DeliverableRepository } from '../../database/repositories/deliverable.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Deliverable } from '../../database/schemas/deliverable.schema';
import { Project } from '../../database/schemas/project.schema';
import { StrategyInterface } from '../interfaces/strategy.interface';
import { DeliverableMapper } from '../mapper/deliverable.mapper';
import { ProjectMapper } from '../mapper/project.mapper';

@Injectable()
export class NewProjectStrategy implements StrategyInterface {
    public constructor(
        private projectMapper: ProjectMapper,
        private deliverableMapper: DeliverableMapper,
        private projectRepository: ProjectRepository,
        private deliverableRepository: DeliverableRepository,
        private proposalRepository: DaoProposalRepository,
    ) {}

    public async canHandle(
        project: Project,
        proposal: DaoProposal,
    ): Promise<boolean> {
        return project === null && proposal === null;
    }

    public async execute(
        project: Project,
        proposal: DaoProposal,
        newProposal: DaoProposal,
        airtableData: any,
    ): Promise<void> {
        const newProject: Project = this.projectMapper.map(airtableData);
        const newDeliverable: Deliverable = this.deliverableMapper.map(
            airtableData,
        );

        newProposal.project = await this.projectRepository.create(newProject);
        newProposal.deliverables = newProposal.deliverables as Types.ObjectId[];
        newProposal.deliverables.push(
            await this.deliverableRepository.create(newDeliverable),
        );

        const databaseProject = await this.projectRepository.findOneRaw({
            find: { _id: newProposal.project },
        });

        databaseProject.daoProposals = databaseProject.daoProposals as Types.ObjectId[];
        databaseProject.daoProposals.push(
            await this.proposalRepository.create(newProposal),
        );

        await this.projectRepository.update(databaseProject);
    }
}
