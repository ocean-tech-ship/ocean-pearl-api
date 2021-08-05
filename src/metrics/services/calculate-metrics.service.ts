import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetDaoProposalsByRoundService } from '../../dao-proposals/services/get-dao-proposals-by-round.service';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Metrics } from '../interfaces/metrics.interface';

@Injectable()
export class CalculateMetricsService {
    constructor(
        private getDaoProposalsByRoundService: GetDaoProposalsByRoundService,
        private roundRepository: RoundRepository,
    ) {}

    public async execute(): Promise<Metrics> {
        let totalVotesCount: number = 0;
        let totalRequestedFunding: number = 0;
        const currentDate = new Date();

        const currentRound = (
            await this.roundRepository.getAll({
                find: {
                    startDate: { $lte: currentDate },
                    votingEndDate: { $gte: currentDate },
                },
            })
        )[0];
        const nextRound = (
            await this.roundRepository.getAll({
                find: { round: currentRound.round + 1 },
            })
        )[0];
        const daoProposals = await this.getDaoProposalsByRoundService.execute(
            currentRound._id,
        );

        for (const proposal of daoProposals) {
            totalRequestedFunding +=
                currentRound.paymentOption === PaymentOptionEnum.Ocean
                    ? proposal.requestedGrantToken
                    : proposal.requestedGrantUsd;
            totalVotesCount += proposal.votes;
        }

        return {
            fundingRound: currentRound.round,
            totalDaoProposals: daoProposals.length,
            startDate: currentRound?.startDate
                ? new Date(currentRound.startDate)
                : null,
            votingStartDate: new Date(currentRound.votingStartDate),
            submissionEndDate: new Date(currentRound.submissionEndDate),
            endDate: new Date(currentRound.votingEndDate),
            nextRoundStartDate: nextRound?.startDate
                ? new Date(nextRound.startDate)
                : null,
            totalRequestedFunding: Math.floor(totalRequestedFunding),
            totalVotes: totalVotesCount,
            paymentOption: currentRound.paymentOption,
        } as Metrics;
    }
}
