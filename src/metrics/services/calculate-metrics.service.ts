import { Injectable } from '@nestjs/common';
import { GetDaoProposalsByRoundService } from '../../dao-proposals/services/get-dao-proposals-by-round.service';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Round } from '../../database/schemas/round.schema';
import { GetCurrentRoundService } from '../../rounds/services/get-current-round.service';
import { Metrics, RoundMetrics } from '../models/metrics.model';

@Injectable()
export class CalculateMetricsService {
    constructor(
        private getDaoProposalsByRoundService: GetDaoProposalsByRoundService,
        private getCurrentRoundService: GetCurrentRoundService,
        private roundRepository: RoundRepository,
    ) {}

    public async execute(round: number = 0): Promise<Metrics> {
        let currentRound;
        let totalVotesCount: number = 0,
            totalRequestedFundingOcean: number = 0,
            totalRequestedFundingUsd: number = 0;

        currentRound =
            round === 0
                ? await this.getCurrentRoundService.execute()
                : await this.roundRepository.findOne({
                      find: { round: round },
                  });

        const nextRound = await this.roundRepository.findOne({
            find: { round: currentRound.round + 1 },
        });

        const daoProposals = await this.getDaoProposalsByRoundService.execute(
            currentRound._id,
        );

        for (const proposal of daoProposals) {
            totalRequestedFundingOcean += proposal.requestedGrantToken;
            totalRequestedFundingUsd += proposal.requestedGrantUsd;
            totalVotesCount += proposal.votes;
        }

        return {
            fundingRound: currentRound.round,
            totalDaoProposals: daoProposals.length,
            currentRound: currentRound
                ? this.mapRoundMetrics(currentRound)
                : null,
            nextRound: nextRound ? this.mapRoundMetrics(nextRound) : null,
            totalRequestedFundingOcean: Math.floor(totalRequestedFundingOcean),
            totalRequestedFundingUsd: Math.floor(totalRequestedFundingUsd),
            totalVotes: totalVotesCount,
            paymentOption: currentRound.paymentOption,
        } as Metrics;
    }

    private mapRoundMetrics(round: Round): RoundMetrics {
        return {
            startDate: round?.startDate ? new Date(round.startDate) : null,
            votingStartDate: round?.votingStartDate
                ? new Date(round.votingStartDate)
                : null,
            submissionEndDate: new Date(round.submissionEndDate),
            endDate: new Date(round.votingEndDate),
        };
    }
}
