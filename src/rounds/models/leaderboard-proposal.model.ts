import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';

export type GrantPoolShare = {
    [key in EarmarkTypeEnum]: number;
};

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

export class NeededVotes {
    @ApiProperty()
    fullyFunded: number;

    @ApiProperty()
    partiallyFunded?: number;
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
    grantPoolShare?: GrantPoolShare;

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
    neededVotes: NeededVotes;
}