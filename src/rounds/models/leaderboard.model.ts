import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { LeaderboardProposal } from './leaderboard-proposal.model';

export class GrantPool {
    @ApiProperty({
        type: EarmarkTypeEnum,
        enum: EarmarkTypeEnum,
    })
    type: EarmarkTypeEnum;

    @ApiProperty()
    totalFunding: number;

    @ApiProperty()
    remainingFunding: number;

    @ApiProperty()
    potentialRemainingFunding?: number;
}

export type LeaderboardGrantPools = {
    [key in EarmarkTypeEnum]: GrantPool;
};

export class Leaderboard {
    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    fundedProposals: LeaderboardProposal[] = [];

    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    partiallyFundedProposals: LeaderboardProposal[] = [];

    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    notFundedProposals: LeaderboardProposal[] = [];

    @ApiProperty()
    amountProposals: number;

    @ApiProperty()
    maxVotes: number;

    @ApiProperty({
        type: Object,
    })
    grantPools: LeaderboardGrantPools;

    @ApiProperty({
        type: String,
        enum: PaymentOptionEnum,
    })
    paymentOption: string;

    @ApiProperty()
    votingStartDate: Date;

    @ApiProperty()
    votingEndDate: Date;

    @ApiProperty({
        type: String,
        enum: RoundStatusEnum,
    })
    status: string;

    @ApiProperty()
    round: number;

    @ApiProperty()
    overallFunding: number;

    @ApiProperty()
    overallRequestedFunding: number;

    @ApiProperty()
    totalVotes: number;
}
