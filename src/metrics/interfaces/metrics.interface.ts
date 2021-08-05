import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';

export interface Metrics {
    fundingRound: number;
    totalDaoProposals: number;
    currentRound: RoundMetrics;
    nextRound: RoundMetrics;
    totalRequestedFunding: number;
    totalVotes: number;
    paymentOption: PaymentOptionEnum;
}

export interface RoundMetrics {
    startDate: Date;
    submissionEndDate: Date;
    votingStartDate: Date;
    endDate: Date;
} 
