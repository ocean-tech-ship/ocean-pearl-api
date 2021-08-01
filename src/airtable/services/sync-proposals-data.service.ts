import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../database/enums/category.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { DeliverableRepository } from '../../database/repositories/deliverable.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { RoundRepository } from '../../database/repositories/round.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Deliverable } from '../../database/schemas/deliverable.schema';
import { Project } from '../../database/schemas/project.schema';
import { Round } from '../../database/schemas/round.schema';
import { CategoryMap } from '../constants/category-map.constant';
import { FundamentalMetricsMap } from '../constants/fundamental-metrics-map.constant';
import { StatesMap } from '../constants/states-map.constant';
import { ProposalsProvider } from '../provider/proposals.provider';

const MAX_SYNC_ROUND = 7;

@Injectable()
export class SyncProposalsDataService {
    private readonly logger = new Logger(SyncProposalsDataService.name);

    public constructor(
        private proposalsProvider: ProposalsProvider,
        private proposalRepository: DaoProposalRepository,
        private roundRepository: RoundRepository,
        private projectRepository: ProjectRepository,
        private deliverableRepository: DeliverableRepository,
    ) {}

    @Cron('0 */30 * * * *', {
        name: 'Round import',
        timeZone: 'Europe/Berlin',
    })
    public async execute(): Promise<void> {
        this.logger.log('Start syncing Proposals from Airtable Job.');
        const roundModel = this.roundRepository.getModel();
        const databaseRounds: Round[] = await roundModel
            .find()
            .sort({ round: 1 })
            .exec();

        for (let round of databaseRounds) {
            if (round.round > MAX_SYNC_ROUND) {
                continue;
            }

            const proposalsResponse: AxiosResponse = await this.proposalsProvider.fetch(
                {
                    Round: round.round,
                },
            );
            const proposals: any = proposalsResponse.data.records;

            for (let proposal of proposals) {
                const {id : proposalAirtableID, fields: proposalFields } = proposal;
                const projectModel = this.projectRepository.getModel();

                let project: Project = await projectModel
                    .findOne({ title: proposalFields['Project Name'].trim() })
                    .exec();
                let newProposal: DaoProposal = this.mapProposal(
                    proposalFields,
                    proposalAirtableID,
                    round,
                );

                if (!project) {
                    const newProject: Project = this.mapProject(proposalFields);

                    const newDeliverable: Deliverable = this.mapDeliverable(
                        proposalFields,
                    );

                    newProposal.project = await this.projectRepository.create(
                        newProject,
                    );
                    newProposal.deliverables = newProposal.deliverables as Types.ObjectId[];
                    newProposal.deliverables.push(
                        await this.deliverableRepository.create(newDeliverable),
                    );

                    let project: Project = await projectModel
                        .findOne({ title: newProject.title })
                        .exec();

                    project.daoProposals = newProject.daoProposals as Types.ObjectId[];
                    project.daoProposals.push(
                        await this.proposalRepository.create(newProposal),
                    );

                    await this.projectRepository.update(project);
                    continue;
                }

                const existingProposal: DaoProposal = await this.fetchExistingProposal(
                    project,
                    proposalAirtableID,
                );

                if (!existingProposal) {
                    const newDeliverable: Deliverable = this.mapDeliverable(
                        proposalFields,
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

                    await this.projectRepository.update(project);
                    continue;
                }

                newProposal._id = existingProposal._id;
                newProposal.id = existingProposal.id;
                newProposal.deliverables = existingProposal.deliverables;
                await this.proposalRepository.update(newProposal);
            }
        }

        this.logger.log('Finish syncing Proposals from Airtable Job.');
    }

    private mapProposal(
        proposal: any,
        airtableId: string,
        round: Round,
    ): DaoProposal {
        return {
            airtableId: airtableId,
            title: proposal['Project Name'].trim(),
            status: StatesMap[proposal['Proposal State']],
            fundingRound: round._id,
            category:
                CategoryMap[proposal['Grant Category'].trim()] ??
                CategoryEnum.Other,
            description: proposal['Overview'],
            standing: proposal['Proposal Standing'] === 'Completed' 
                ? StandingEnum.Completed
                : StandingEnum.Unreported,
            fundamentalMetric:
                FundamentalMetricsMap[proposal['Fundamental Metric']],
            requestedGrantToken: proposal['OCEAN Requested']
                ? (proposal['OCEAN Requested'] as number)
                : 0,
            grantedToken: proposal['OCEAN Granted']
                ? (proposal['OCEAN Granted'] as number)
                : 0,
            oceanProtocolPortUrl: proposal['Proposal URL'] ?? '',
            snapshotBlock: proposal['Snapshot Block'],
            ipfsHash: proposal['ipfsHash'],
            votes: proposal['Voted Yes']
                ? Math.floor(proposal['Voted Yes'] as number)
                : 0,
            counterVotes: proposal['Voted No']
                ? Math.floor(proposal['Voted No'] as number)
                : 0,
            deliverables: [],
            createdAt: new Date(proposal['Created Date']),
        } as DaoProposal;
    }

    private mapProject(proposal: any): Project {
        return {
            title: proposal['Project Name'].trim(),
            description: proposal['One Liner'],
            category:
                CategoryMap[proposal['Grant Category'].trim()] ??
                CategoryEnum.Other,
            walletAddress: proposal['Wallet Address'],
            paymentWalletsAddresses: proposal['Payment Wallets']
                ? proposal['Payment Wallets'].split('\n')
                : [],
            teamName: proposal['Team Name (from Login Email)']
                ? proposal['Team Name (from Login Email)'][0]
                : proposal['Project Name'].trim(),
            createdAt: new Date(proposal['Created Date']),
            daoProposals: [],
        } as Project;
    }

    private mapDeliverable(proposal: any): Deliverable {
        return {
            title: 'Deliverables',
            description: proposal['Grant Deliverables'],
        } as Deliverable;
    }

    private async fetchExistingProposal(
        project: Project,
        airtableId: string,
    ): Promise<DaoProposal | null> {
        if (project.daoProposals.length === 0) {
            return null;
        }

        for (let proposal of project.daoProposals) {
            const proposalModel = this.proposalRepository.getModel();
            let databaseProposal: DaoProposal = await proposalModel
                .findById(proposal)
                .populate({
                    path: 'fundingRound',
                })
                .exec();

            if (databaseProposal.airtableId === airtableId) {
                return databaseProposal;
            }
        }

        return null;
    }
}
