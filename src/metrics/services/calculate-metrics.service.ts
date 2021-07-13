import { Injectable } from '@nestjs/common';
import { GetDaoProposalsByRoundService } from '../../dao-proposals/services/get-dao-proposals-by-round.service';
import { RoundRepository } from '../../database/repositories/round.repository';
import { Metrics } from '../interfaces/metrics.interface';

@Injectable()
export class CalculateMetricsService {
    constructor(
        private getDaoProposalsByRoundService: GetDaoProposalsByRoundService,
        private roundRepository: RoundRepository
    ) {}

    public async execute(): Promise<Metrics> {
        let totalVotesCount: number = 0;
        let totalRequestedFunding: number = 0;
        const roundModel = await this.roundRepository.getModel();

        const latestRound = (await roundModel.find().sort({ round: -1 }).exec())[0];
        const daoProposals = await this.getDaoProposalsByRoundService.execute(latestRound._id);

        for (const proposal of daoProposals) {
            totalVotesCount += proposal.votes;
            totalRequestedFunding += proposal.requestedGrantToken;
        }

        return {
            fundingRound: latestRound.round,
            totalDaoProposals: daoProposals.length,
            endDate: new Date(latestRound.votingEndDate),
            startDate: new Date(latestRound.votingStartDate),
            submissionEndDate: new Date(latestRound.submissionEndDate),
            totalRequestedFunding: totalRequestedFunding,
            totalVotes: totalVotesCount,
        };
    }
}
