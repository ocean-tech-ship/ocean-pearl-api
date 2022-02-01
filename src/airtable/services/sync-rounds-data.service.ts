import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../database/enums/remaining-funding-strategy.enum';
import { FindQuery } from '../../database/interfaces/find-query.interface';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Earmark } from '../../database/schemas/earmark.schema';
import { EarmarksType, Round, RoundType } from '../../database/schemas/round.schema';
import { BallotTypeMap } from '../constants/ballot-type-map.constant';
import { EarmarkTypeMap } from '../constants/earmark-type-map.constant';
import { VoteTypeMap } from '../constants/vote-type-map.constant';
import { RoundsProvider } from '../provider/rounds.provider';

@Injectable()
export class SyncRoundsDataService {
    private readonly logger = new Logger(SyncRoundsDataService.name);
    private readonly USD_OPTION_START_ROUND = 8;
    private readonly RECYCLING_START_ROUND = 13;

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

            await this.syncRound(newRound);
        }

        this.logger.log('Finish syncing Rounds from Airtable Job.');
    }

    private mapRound(round: any): Round {
        const mappedRound: Round = {
            round: round['Round'],
            paymentOption:
                round['Round'] >= this.USD_OPTION_START_ROUND
                    ? PaymentOptionEnum.Usd
                    : PaymentOptionEnum.Ocean,
            basisCurrency: round['Basis Currency'],
            ballotType: BallotTypeMap[round['Ballot Type']],
            voteType: VoteTypeMap[round['Vote Type']],
            maxGrantOcean: round['Max Grant'] ?? 0,
            maxGrantUsd: round['Max Grant USD'] ?? 0,
            availableFundingOcean: round['Funding Available'] ?? 0,
            availableFundingUsd: round['Funding Available USD'] ?? 0,
            earmarks: {},
            remainingFundingStrategy:
                round['Round'] >= this.RECYCLING_START_ROUND
                    ? RemainingFundingStrategyEnum.Recycle
                    : RemainingFundingStrategyEnum.Burn,
            usdConversionRate: round['OCEAN Price'] ?? undefined,
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

        if (round['Earmarks']) {
            const earmarks = JSON.parse(round['Earmarks']);

            mappedRound.earmarks = this.mapEarmarks(earmarks, mappedRound.usdConversionRate);
        }

        if (mappedRound.usdConversionRate) {
            mappedRound.availableFundingOcean =
                mappedRound.availableFundingOcean === 0
                    ? parseFloat(
                          (mappedRound.availableFundingUsd / mappedRound.usdConversionRate).toFixed(
                              3,
                          ),
                      )
                    : mappedRound.availableFundingOcean;

            mappedRound.availableFundingUsd =
                mappedRound.availableFundingUsd === 0
                    ? parseFloat(
                          (
                              mappedRound.availableFundingOcean * mappedRound.usdConversionRate
                          ).toFixed(3),
                      )
                    : mappedRound.availableFundingUsd;
        }

        return mappedRound;
    }

    private mapEarmarks(earmarks: any, usdConversionRate: number): EarmarksType {
        let mappedEarmarks: any = {};

        for (const [index, data] of Object.entries(earmarks)) {
            if (!EarmarkTypeMap[index]) {
                continue;
            }

            let earmark: Earmark = {
                type: EarmarkTypeMap[index],
                fundingOcean: data['OCEAN'],
                fundingUsd: data['USD'],
            } as Earmark;

            if (usdConversionRate) {
                earmark.fundingOcean =
                    earmark.fundingOcean === 0
                        ? parseFloat((earmark.fundingUsd / usdConversionRate).toFixed(3))
                        : earmark.fundingOcean;

                earmark.fundingUsd =
                    earmark.fundingUsd === 0
                        ? parseFloat((earmark.fundingOcean * usdConversionRate).toFixed(3))
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
        } as FindQuery<RoundType>;
        const databaseRound: Round = await this.roundsRepository.findOne(findQuery);

        if (databaseRound == null) {
            await this.roundsRepository.create(round);
        } else {
            round.id = databaseRound?.id ?? undefined;
            await this.roundsRepository.update(round);
        }
    }
}
