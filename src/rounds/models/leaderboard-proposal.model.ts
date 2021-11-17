import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';

export class LeaderboardProject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    completedProposals: number;

    @ApiProperty()
    logoUrl: string;

    @ApiProperty()
    title: string;
}

export class LeaderboardProposal {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    project: LeaderboardProject;

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
    earmarkType: EarmarkTypeEnum;

    @ApiProperty()
    tags: string[];

    @ApiProperty()
    voteUrl: string;

    @ApiProperty()
    neededVotes: number;
}