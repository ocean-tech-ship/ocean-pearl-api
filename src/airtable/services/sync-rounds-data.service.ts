import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { CurrencyEnum } from '../../database/enums/currency.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round } from '../../database/schemas/round.schema';
import { RoundsProvider } from '../provider/rounds.provider';

@Injectable()
export class SyncRoundsDataService {
    private readonly logger = new Logger(SyncRoundsDataService.name);

    public constructor(
        private roundsProvider: RoundsProvider,
        private roundsRepository: RoundRepository,
    ) {}

    @Cron('0 0 0 * * *', {
        name: 'Proposals import',
        timeZone: 'Europe/Berlin',
    })
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
            earmarked: round.Earmarked ?? round['Earmarked USD'],
            maxGrant: round['Max Grant'] ?? round['Max Grant USD'],
            grantCurrency: round['Max Grant']
                ? CurrencyEnum.Ocean
                : CurrencyEnum.Usd,
            availableFunding:
                round['Funding Available'] ?? round['Funding Available USD'],
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
        const databaseRounds: Round[] = await this.roundsRepository.getAll(
            findQuery,
        );

        if (databaseRounds.length === 0) {
            this.roundsRepository.create(round);
            return;
        }

        round.id = databaseRounds[0].id;
        this.roundsRepository.update(round);
    }
}
