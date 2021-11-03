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
    private readonly USD_OPTION_START_ROUND = 8;

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

        for (const round of airtbaleRounds) {
            const newRound: Round = this.mapRound(round.fields);

            if (!newRound.round) {
                // Ignore empty rows
                continue;
            }

            await this.syncRound(newRound);
        }

        this.logger.log('Finish syncing Rounds from Airtable Job.');
    }

    private mapRound(round: any): Round {
        const mappedRound: Round = {
            round: round['Round'],
            earmarkedFundingOcean: round['Earmarked'] ?? 0,
            earmarkedFundingUsd: round['Earmarked USD'],
            maxGrantOcean: round['Max Grant'] ?? 0,
            maxGrantUsd: round['Max Grant USD'] ?? 0,
            paymentOption:
                round['Round'] <= this.USD_OPTION_START_ROUND
                    ? PaymentOptionEnum.Ocean
                    : PaymentOptionEnum.Usd,
            availableFundingOcean: round['Funding Available'] ?? 0,
            availableFundingUsd: round['Funding Available USD'] ?? 0,
            usdConversionRate: round['OCEAN Price'] ?? 0,
            startDate: round['Start Date']
                ? new Date(round['Start Date'])
                : null,
            submissionEndDate: new Date(round['Proposals Due By']),
            votingStartDate: round['Voting Starts']
                ? new Date(round['Voting Starts'])
                : null,
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
        const databaseRound: Round = await this.roundsRepository.findOne(
            findQuery,
        );

        if (databaseRound == null) {
            await this.roundsRepository.create(round);
        } else {
            round.id = databaseRound?.id ?? undefined;
            await this.roundsRepository.update(round);
        }
    }
}
