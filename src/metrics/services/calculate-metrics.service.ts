import { Injectable } from '@nestjs/common';
import { GetDaoProposalsByRoundService } from '../../dao-proposals/services/get-dao-proposals-by-round.service';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Funding } from '../../database/schemas/funding.schema';
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
        let totalVotesCount: number = 0;
        const totalRequestedFunding = new Funding();
        const currentRound =
            round === 0
                ? await this.getCurrentRoundService.execute()
                : await this.roundRepository.findOneRaw({
                      find: { round: round },
                  });

        const nextRound = await this.roundRepository.findOneRaw({
            find: { round: currentRound.round + 1 },
        });

        const daoProposals = await this.getDaoProposalsByRoundService.execute(currentRound._id);

        for (const proposal of daoProposals) {
            totalRequestedFunding.addFunding(proposal.requestedFunding);
            totalVotesCount += proposal.yesVotes + proposal.noVotes;
        }

        totalRequestedFunding.usd = Math.round(totalRequestedFunding.usd);
        totalRequestedFunding.ocean = Math.round(totalRequestedFunding.ocean);

        return {
            fundingRound: currentRound.round,
            totalDaoProposals: daoProposals.length,
            currentRound: currentRound ? this.mapRoundMetrics(currentRound) : null,
            nextRound: nextRound ? this.mapRoundMetrics(nextRound) : null,
            totalRequestedFunding: totalRequestedFunding,
            totalVotes: totalVotesCount,
            paymentOption: currentRound.paymentOption,
        } as Metrics;
    }

    private mapRoundMetrics(round: Round): RoundMetrics {
        return {
            startDate: round?.startDate ? new Date(round.startDate) : null,
            votingStartDate: round?.votingStartDate ? new Date(round.votingStartDate) : null,
            submissionEndDate: round?.submissionEndDate ? new Date(round.submissionEndDate) : null,
            endDate: round?.votingEndDate ? new Date(round.votingEndDate) : null,
        };
    }
}
