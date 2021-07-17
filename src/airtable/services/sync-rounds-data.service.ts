import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { Round } from '../../database/schemas/round.schema';
import { RoundsProvider } from '../provider/rounds.provider';
import { ProposalsProvider } from '../provider/proposals.provider';
import { RoundRepository } from '../../database/repositories/round.repository';
import { AxiosResponse } from 'axios';
import { FindQuery } from '../../database/interfaces/find-query.interface';

@Injectable()
export class SyncRoundsDataService {
    private readonly logger = new Logger(SyncRoundsDataService.name);

    public constructor(
        private roundsProvider: RoundsProvider,
        private proposalsProvider: ProposalsProvider,
        private roundsRepository: RoundRepository,
    ) {}

    // @Cron('0 0 0 * * *', {
    //     name: 'Proposals import',
    //     timeZone: 'Europe/Berlin',
    // })
    public async execute(): Promise<void> {
        this.logger.log('Start syncing Rounds Job.');

        const roundsResponse: AxiosResponse = await this.roundsProvider.fetch();
        const airtbaleRounds = roundsResponse.data.records;

        for (let round of airtbaleRounds) {
            round = round.fields;

            const newRound: Round = this.mapRound(round);

            this.syncRound(newRound);
        }

        this.logger.log('Finish syncing Rounds Job.');
    }

    private mapRound(round: any): Round {
        let mappedRound: Round = {
            round: round.name.split(' ')[1],
            earmarked: round.Earmarked ?? 0,
            maxGrant: round['Max Grant'],
            availableFunding: round['Funding Available'],
            submissionEndDate: new Date(round['Proposals Due By']),
            votingEndDate: new Date(round['Voting Ends']),
        } as Round;

        const startDate: Date = new Date(round['Proposals Due By']);

        startDate.setDate(startDate.getDate() + 1);
        startDate.setUTCHours(0, 0, 0, 0);

        mappedRound.votingStartDate = startDate;

        return mappedRound;
    }

    private async syncRound(round: Round): Promise<void> {
        const findQuery = {
            find: {
                round: round.round,
            },
        } as FindQuery;
        const databaseRound: Round[] = await this.roundsRepository.getAll(
            findQuery,
        );

        if (databaseRound.length === 0) {
            this.roundsRepository.create(round);
            return;
        }

        round.id = databaseRound[0].id;
        this.roundsRepository.update(round);
    }
}
