import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { RoundRepository } from '../../database/repositories/round.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { Round } from '../../database/schemas/round.schema';
import { DaoProposalMapper } from '../mapper/dao-proposal.mapper';
import { ProposalsProvider } from '../provider/proposals.provider';
import { StrategyCollection } from '../strategies/strategy.collection';

@Injectable()
export class SyncProposalsDataService {
    private readonly logger = new Logger(SyncProposalsDataService.name);

    private openRunTimestamp = -1;

    public constructor(
        private proposalsProvider: ProposalsProvider,
        private proposalRepository: DaoProposalRepository,
        private roundRepository: RoundRepository,
        private projectRepository: ProjectRepository,
        private daoProposalMapper: DaoProposalMapper,
        private strategyCollection: StrategyCollection,
    ) {}

    @Cron('0 */5 * * * *', {
        name: 'Proposal import',
        timeZone: 'Europe/Berlin',
    })
    public async execute(): Promise<void> {
        this.logger.log('Start syncing Proposals from Airtable Job.');

        if (this.openRunTimestamp === -1) {
            // Only reset if last run was successful
            this.openRunTimestamp = Date.now();
        }

        const databaseRounds: Round[] = await this.roundRepository.getAll({
            sort: {
                round: 1,
            },
        });

        for (let round of databaseRounds) {
            const proposalsResponse: AxiosResponse = await this.proposalsProvider.fetch(
                {
                    Round: round.round,
                },
            );
            const proposals: any = proposalsResponse.data.records;

            if (proposals.length === 0) {
                await new Promise(() => setTimeout(_ => _, 2000));
                continue;
            }

            for (let proposal of proposals) {
                const {
                    id: proposalAirtableID,
                    fields: proposalFields,
                } = proposal;

                const databaseProject: Project = await this.projectRepository.findOneRaw(
                    { find: { title: proposalFields['Project Name'].trim() } },
                );

                const databaseProposal: DaoProposal = await this.proposalRepository.findOneRaw(
                    { find: { airtableId: proposalAirtableID } },
                );

                const newProposal: DaoProposal = this.daoProposalMapper.map(
                    proposalFields,
                    proposalAirtableID,
                    round._id,
                );

                const strategy = await this.strategyCollection.findMatchingStrategy(
                    databaseProject,
                    databaseProposal,
                );

                await strategy.execute(
                    databaseProject,
                    databaseProposal,
                    newProposal,
                    proposalFields,
                );
            }
        }

        this.openRunTimestamp = -1;
        this.logger.log('Finish syncing Proposals from Airtable Job.');
    }

    public getOpenRunTimestamp(): number {
        return this.openRunTimestamp;
    }
}
