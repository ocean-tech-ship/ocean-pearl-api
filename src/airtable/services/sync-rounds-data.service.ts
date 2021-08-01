import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
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
        this.logger.log('Start syncing Rounds from Airtable Job.');

        const roundsResponse: AxiosResponse = await this.roundsProvider.fetch();
        const airtbaleRounds = roundsResponse.data.records;

        for (let round of airtbaleRounds) {
            const newRound: Round = this.mapRound(round.fields);

            this.syncRound(newRound);
        }

        this.logger.log('Finish syncing Rounds from Airtable Job.');
    }

    private mapRound(round: any): Round {
        let mappedRound: Round = {
            round: round['Round'].split(' ')[1],
            earmarked: round['Earmarked'] ?? round['Earmarked USD'],
            maxGrant: round['Max Grant'] ?? round['Max Grant USD'],
            paymentOption: round['Max Grant']
                ? PaymentOptionEnum.Ocean
                : PaymentOptionEnum.Usd,
            availableFunding:
                round['Funding Available'] ?? round['Funding Available USD'],
            startDate: round['Start Date'] ? new Date(round['Start Date']) : null,
            submissionEndDate: new Date(round['Proposals Due By']),
            votingStartDate: round['Voting Starts'] ? new Date(round['Voting Starts']) : null,
            votingEndDate: new Date(round['Voting Ends']),
        } as Round;

        if (!mappedRound.votingStartDate) {
            const startDate: Date = new Date(round['Proposals Due By']);

            startDate.setDate(startDate.getDate() + 1);
            startDate.setUTCHours(0, 0, 0, 0);

            mappedRound.votingStartDate = startDate;
        }

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
