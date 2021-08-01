export interface Metrics {
    fundingRound: number;
    totalDaoProposals: number;
    startDate?: Date;
    submissionEndDate: Date;
    votingStartDate: Date;
    endDate: Date;
    nextRoundStartDate?: Date;
    totalRequestedFunding: number;
    totalVotes: number;
}
