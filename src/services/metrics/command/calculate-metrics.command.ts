import { Inject } from 'typescript-ioc';
import { GetOpenDaoProposalsCommand } from '../../dao-proposal/command/get-open-doa-proposals.command';
import { CalculateMetricsCommandApi } from '../api/calculate-metrics-command.api';
import { MetricsInterface } from '../interface/metrics.interface';

const CURRENT_ROUND: number = 5;

export class CalculateMetricsCommand implements CalculateMetricsCommandApi {
    getOpenDaoProposalsComand: GetOpenDaoProposalsCommand;

    constructor(
        @Inject
        getOpenDaoProposalsComand: GetOpenDaoProposalsCommand
    ) {
        this.getOpenDaoProposalsComand = getOpenDaoProposalsComand;
    }

    public async execute(): Promise<MetricsInterface> {
        let totalVotesCount: number = 0;
        let totalRequestedFunding: number = 0;
        const daoProposals = await this.getOpenDaoProposalsComand.execute(CURRENT_ROUND);

        for (const proposal of daoProposals) {
            totalVotesCount += proposal.votes;
            totalRequestedFunding += proposal.requestedGrantToken;
        }

        return {
            fundingRound: CURRENT_ROUND,
            totalDaoProposals: daoProposals.length,
            endDate: new Date(),
            totalRequestedFunding: totalRequestedFunding,
            totalVotes: totalVotesCount,
        };
    }
}
