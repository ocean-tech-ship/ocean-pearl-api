import { Inject } from 'typescript-ioc';
import { GetDaoProposalsByRoundCommand } from '../../dao-proposal/command/get-dao-proposals-by-round.command';
import { CalculateMetricsCommandApi } from '../api/calculate-metrics-command.api';
import { MetricsInterface } from '../interface/metrics.interface';

const CURRENT_ROUND: number = 6;

export class CalculateMetricsCommand implements CalculateMetricsCommandApi {
    getDaoProposalsByRoundCommand: GetDaoProposalsByRoundCommand;

    constructor(
        @Inject
        getDaoProposalsByRoundCommand: GetDaoProposalsByRoundCommand
    ) {
        this.getDaoProposalsByRoundCommand = getDaoProposalsByRoundCommand;
    }

    public async execute(): Promise<MetricsInterface> {
        let totalVotesCount: number = 0;
        let totalRequestedFunding: number = 0;
        const daoProposals = await this.getDaoProposalsByRoundCommand.execute(CURRENT_ROUND);

        for (const proposal of daoProposals) {
            totalVotesCount += proposal.votes;
            totalRequestedFunding += proposal.requestedGrantToken;
        }

        return {
            fundingRound: CURRENT_ROUND,
            totalDaoProposals: daoProposals.length,
            endDate: daoProposals[0].finishDate,
            totalRequestedFunding: totalRequestedFunding,
            totalVotes: totalVotesCount,
        };
    }
}
