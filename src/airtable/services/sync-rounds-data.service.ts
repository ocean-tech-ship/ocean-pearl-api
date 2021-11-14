import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Earmark } from '../../database/schemas/earmark.schema';
import { EarmarksType, Round } from '../../database/schemas/round.schema';
import { EarmarkTypeMap } from '../constants/earmark-type-map.constant';
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
            if (!round.fields['Round']) {
                continue;
            }

            const newRound: Round = this.mapRound(round.fields);

            this.syncRound(newRound);
        }

        this.logger.log('Finish syncing Rounds from Airtable Job.');
    }

    private mapRound(round: any): Round {
        let mappedRound: Round = {
            round: round['Round'],
            paymentOption:
                round['Round'] <= this.USD_OPTION_START_ROUND
                    ? PaymentOptionEnum.Ocean
                    : PaymentOptionEnum.Usd,
            basisCurrency: round['Basis Currency'],
            maxGrantOcean: round['Max Grant'] ?? 0,
            maxGrantUsd: round['Max Grant USD'] ?? 0,
            availableFundingOcean: round['Funding Available'] ?? 0,
            availableFundingUsd: round['Funding Available USD'] ?? 0,
            earmarks: {},
            usdConversionRate: round['OCEAN Price'] ?? undefined,
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

        if (round['Earmarks']) {
            const earmarks = JSON.parse(round['Earmarks']);

            mappedRound.earmarks = this.mapEarmarks(
                earmarks,
                mappedRound.usdConversionRate,
            );
        }

        if (mappedRound.usdConversionRate) {
            mappedRound.availableFundingOcean =
                mappedRound.availableFundingOcean === 0
                    ? parseFloat(
                          (
                              mappedRound.availableFundingUsd /
                              mappedRound.usdConversionRate
                          ).toFixed(3),
                      )
                    : mappedRound.availableFundingOcean;

            mappedRound.availableFundingUsd =
                mappedRound.availableFundingUsd === 0
                    ? parseFloat(
                          (
                              mappedRound.availableFundingOcean *
                              mappedRound.usdConversionRate
                          ).toFixed(3),
                      )
                    : mappedRound.availableFundingUsd;
        }

        return mappedRound;
    }

    private mapEarmarks(
        earmarks: any,
        usdConversionRate: number,
    ): EarmarksType {
        let mappedEarmarks: any = {};

        for (const [index, data] of Object.entries(earmarks)) {
            let earmark: Earmark = {
                type: EarmarkTypeMap[index],
                fundingOcean: data['OCEAN'],
                fundingUsd: data['USD'],
            } as Earmark;

            if (usdConversionRate) {
                earmark.fundingOcean =
                    earmark.fundingOcean === 0
                        ? parseFloat(
                              (earmark.fundingUsd / usdConversionRate).toFixed(
                                  3,
                              ),
                          )
                        : earmark.fundingOcean;

                earmark.fundingUsd =
                    earmark.fundingUsd === 0
                        ? parseFloat(
                              (
                                  earmark.fundingOcean * usdConversionRate
                              ).toFixed(3),
                          )
                        : earmark.fundingUsd;
            }

            mappedEarmarks[EarmarkTypeMap[index]] = earmark;
        }

        return mappedEarmarks as EarmarksType;
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

        round.id = databaseRound?.id ?? undefined;
        this.roundsRepository.update(round);
    }
}
