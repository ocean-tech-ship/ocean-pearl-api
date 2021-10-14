import { ApiProperty } from '@nestjs/swagger';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { LeaderboardProposal } from './leaderboard-proposal.model';

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
    maxVotes: number;

    @ApiProperty()
    remainingEarmarkFundingUsd: number;

    @ApiProperty()
    remainingGeneralFundingUsd: number;

    @ApiProperty()
    voteEndDate: Date;

    @ApiProperty({
        type: String,
        enum: RoundStatusEnum
    })
    status: string;
}
