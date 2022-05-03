import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { LeaderboardProject } from './leaderboard-project.model';

export type GrantPoolShare = {
    [key in EarmarkTypeEnum]?: number;
};

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
    minimumRequestedFunding: number = 0;

    @ApiProperty()
    receivedFunding: number = 0;

    @ApiProperty()
    grantPoolShare: GrantPoolShare = {};

    @ApiProperty()
    yesVotes: number;

    @ApiProperty()
    noVotes: number;

    @ApiProperty()
    effectiveVotes: number;

    @ApiProperty()
    isEarmarked: boolean = false;

    @ApiProperty()
    earmarkType: EarmarkTypeEnum;

    @ApiProperty()
    tags: string[];

    constructor(attributes: Partial<LeaderboardProposal> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }

    public addToGrantPoolShare(pool: EarmarkTypeEnum, amount: number) {
        this.grantPoolShare[pool] = this.grantPoolShare[pool]
            ? this.grantPoolShare[pool] + amount
            : amount;
    }

    public hasReceivedMinimalFunding(): boolean {
        return this.receivedFunding > this.minimumRequestedFunding;
    }
}
