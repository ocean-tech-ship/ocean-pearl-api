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

@Injectable()
export class NewProposalStrategy implements StrategyInterface {
    public constructor(
        private deliverableMapper: DeliverableMapper,
        private projectRepository: ProjectRepository,
        private deliverableRepository: DeliverableRepository,
        private proposalRepository: DaoProposalRepository,
    ) {}

    public async canHandle(
        project: Project,
        proposal: DaoProposal,
    ): Promise<boolean> {
        return project !== null && proposal === null;
    }

    public async execute(
        project: Project,
        proposal: DaoProposal,
        newProposal: DaoProposal,
        airtableData: any,
    ): Promise<void> {
        const newDeliverable: Deliverable = this.deliverableMapper.map(
            airtableData,
        );

        newProposal.project = project._id;
        newProposal.deliverables = newProposal.deliverables as Types.ObjectId[];
        newProposal.deliverables.push(
            await this.deliverableRepository.create(newDeliverable),
        );

        project.daoProposals = project.daoProposals as Types.ObjectId[];
        project.daoProposals.push(
            await this.proposalRepository.create(newProposal),
        );

        if (!project.associatedAddresses.includes(newProposal.walletAddress)) {
            project.associatedAddresses.unshift(newProposal.walletAddress);
        }

        for (const address of airtableData['Payment Wallets'].split('\n')) {
            if (!project.paymentWalletsAddresses.includes(address)) {
                project.paymentWalletsAddresses.unshift(address);
            }
        }

        await this.projectRepository.update(project);
    }
}