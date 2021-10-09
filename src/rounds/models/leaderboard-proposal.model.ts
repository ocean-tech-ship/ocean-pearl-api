import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardProposal {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    requestedFunding: number;

    @ApiProperty()
    receivedFunding: number;

    @ApiProperty()
    yesVotes: number;

    @ApiProperty()
    noVotes: number;

    @ApiProperty()
    effectiveVotes: number;

    @ApiProperty()
    isEarmarked: boolean;

    @ApiProperty()
    tags: string[];

    @ApiProperty()
    completedProposals: number;

    @ApiProperty()
    voteUrl: string;

    @ApiProperty()
    neededVotes: number;
}