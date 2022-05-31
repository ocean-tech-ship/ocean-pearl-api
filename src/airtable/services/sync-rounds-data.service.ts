import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../../database/enums/remaining-funding-strategy.enum';
import { RoundRepository } from '../../database/repositories/round.repository';
import { GrantPool } from '../../database/schemas/grant-pool.schema';
import { GrantPoolsType, Round, RoundType } from '../../database/schemas/round.schema';
import { BallotTypeMap } from '../constants/ballot-type-map.constant';
import { EarmarkTypeMap } from '../constants/earmark-type-map.constant';
import { VoteTypeMap } from '../constants/vote-type-map.constant';
import { RoundsProvider } from '../provider/rounds.provider';

@Injectable()
export class SyncRoundsDataService {
    private readonly logger = new Logger(SyncRoundsDataService.name);
    private readonly USD_OPTION_START_ROUND = 8;
    private readonly RECYCLING_START_ROUND = 13;

    private openRunTimestamp = -1;

    public constructor(
        private roundsProvider: RoundsProvider,
        private roundsRepository: RoundRepository,
    ) {}

    @Cron(CronExpression.EVERY_HOUR, {
        name: 'Proposals import',
        timeZone: 'Europe/Berlin',
    })
    public async execute(): Promise<void> {
        this.logger.log('Start syncing Rounds from Airtable Job.');

        if (this.openRunTimestamp === -1) {
            // Only reset if last run was successful
            this.openRunTimestamp = Date.now();
        }

        const roundsResponse: AxiosResponse = await this.roundsProvider.fetch();
        const airtbaleRounds = roundsResponse.data.records;

        for (const round of airtbaleRounds) {
            if (!round.fields['Round']) {
                continue;
            }

            const newRound: Round = this.mapRound(round.fields);

            await this.syncRound(newRound);
        }

        this.openRunTimestamp = -1;
        this.logger.log('Finish syncing Rounds from Airtable Job.');
    }

    public getOpenRunTimestamp(): number {
        return this.openRunTimestamp;
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
            maxGrant: {
                usd: round['Max Grant USD'] ?? 0,
                ocean: round['Max Grant'] ?? 0,
            },
            availableFunding: {
                usd: round['Funding Available USD'] ?? 0,
                ocean: round['Funding Available'] ?? 0,
            },
            grantPools: {},
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

            mappedRound.grantPools = this.mapFundingPools(earmarks, mappedRound.usdConversionRate);
        }

        if (mappedRound.usdConversionRate) {
            mappedRound.availableFunding.ocean =
                mappedRound.availableFunding.ocean === 0
                    ? parseFloat(
                          (
                              mappedRound.availableFunding.usd / mappedRound.usdConversionRate
                          ).toFixed(3),
                      )
                    : mappedRound.availableFunding.ocean;

            mappedRound.availableFunding.usd =
                mappedRound.availableFunding.usd === 0
                    ? parseFloat(
                          (
                              mappedRound.availableFunding.ocean * mappedRound.usdConversionRate
                          ).toFixed(3),
                      )
                    : mappedRound.availableFunding.usd;
        }

        return mappedRound;
    }

    private mapFundingPools(earmarks: any, usdConversionRate: number): GrantPoolsType {
        let mappedEarmarks: any = {};

        for (const [index, data] of Object.entries(earmarks)) {
            if (!EarmarkTypeMap[index]) {
                continue;
            }

            let earmark: GrantPool = {
                type: EarmarkTypeMap[index],
                fundingOcean: data['OCEAN'],
                fundingUsd: data['USD'],
            } as GrantPool;

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

        return mappedEarmarks as GrantPoolsType;
    }

    private async syncRound(round: Round): Promise<void> {
        const databaseRound: Round = await this.roundsRepository.findOne({
            find: {
                round: round.round,
            },
        });

        if (databaseRound === null) {
            await this.roundsRepository.create(round);
        } else {
            round.id = databaseRound?.id ?? undefined;
            await this.roundsRepository.update(round);
        }
    }
}
