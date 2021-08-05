import { Injectable } from '@nestjs/common';
import { GetDaoProposalsByRoundService } from '../../dao-proposals/services/get-dao-proposals-by-round.service';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round } from '../../database/schemas/round.schema';
import { Metrics, RoundMetrics } from '../interfaces/metrics.interface';

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
            currentRound: this.mapRoundMetrics(currentRound),
            nextRound: this.mapRoundMetrics(nextRound),
            totalRequestedFunding: Math.floor(totalRequestedFunding),
            totalVotes: totalVotesCount,
            paymentOption: currentRound.paymentOption,
        } as Metrics;
    }

    private mapRoundMetrics(round: Round): RoundMetrics {
        return {
            startDate: round?.startDate
                ? new Date(round.startDate)
                : null,
            votingStartDate: round?.votingStartDate 
                ? new Date(round.votingStartDate)
                : null,
            submissionEndDate: new Date(round.submissionEndDate),
            endDate: new Date(round.votingEndDate),
        }
    }
}
