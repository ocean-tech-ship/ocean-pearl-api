import { ApiProperty } from '@nestjs/swagger';
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
    voteEndDate: Date;
}
