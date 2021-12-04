import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { PaymentOptionEnum } from '../../database/enums/payment-option.enum';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { LeaderboardProposal } from './leaderboard-proposal.model';

export class LeaderboardEarmark {
    @ApiProperty({
        type: EarmarkTypeEnum,
        enum: EarmarkTypeEnum,
    })
    type: EarmarkTypeEnum;

    @ApiProperty()
    remainingFunding: number;
}

export type LeaderboardEarmarks = {
    [key in EarmarkTypeEnum]: LeaderboardEarmark;
};

export class Leaderboard {
    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    fundedProposals: LeaderboardProposal[];

    @ApiProperty({
        type: LeaderboardProposal,
        isArray: true,
    })
    notFundedProposals: LeaderboardProposal[];

    @ApiProperty()
    amountProposals: number;

    @ApiProperty()
    maxVotes: number;

    @ApiProperty({
        type: Object,
    })
    earmarks: LeaderboardEarmarks;

    @ApiProperty()
    remainingGeneralFunding: number;

    @ApiProperty({
        type: String,
        enum: PaymentOptionEnum,
    })
    paymentOption: string;

    @ApiProperty()
    voteStartDate: Date;

    @ApiProperty()
    voteEndDate: Date;

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
