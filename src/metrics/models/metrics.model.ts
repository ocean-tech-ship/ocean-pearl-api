import { ApiProperty } from '@nestjs/swagger';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';

export class RoundMetrics {
    @ApiProperty()
    startDate: Date;
    
    @ApiProperty()
    submissionEndDate: Date;
    
    @ApiProperty()
    votingStartDate: Date;
    
    @ApiProperty()
    endDate: Date;
} 

export class Metrics {
    @ApiProperty()
    fundingRound: number;

    @ApiProperty()
    totalDaoProposals: number;
    
    @ApiProperty()
    currentRound: RoundMetrics;
    
    @ApiProperty()
    nextRound: RoundMetrics;
    
    @ApiProperty()
    totalRequestedFundingOcean: number;
    
    @ApiProperty()
    totalRequestedFundingUsd: number;
    
    @ApiProperty()
    totalVotes: number;
    
    @ApiProperty()
    paymentOption: PaymentOptionEnum;
}
