import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';
import { LeaderboardProject } from './leaderboard-project.model';
import { NeededVotes } from './neede-votes.model';

export interface LeaderboardProposalProperties {
    id?: string;
    title?: string;
    project?: LeaderboardProject;
    requestedFunding?: number;
    receivedFunding?: number;
    grantPoolShare?: Partial<GrantPoolShare>;
    yesVotes?: number;
    noVotes?: number;
    effectiveVotes?: number;
    isEarmarked?: boolean;
    earmarkType?: EarmarkTypeEnum;
    tags?: string[];
    neededVotes?: NeededVotes;
}

export type GrantPoolShare = {
    [key in EarmarkTypeEnum]: number;
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
    receivedFunding: number = 0;

    @ApiProperty()
    grantPoolShare: Partial<GrantPoolShare> = {};

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

    @ApiProperty()
    neededVotes: NeededVotes;

    constructor(attributes: LeaderboardProposalProperties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }

    public addToGrantPoolShare(pool: EarmarkTypeEnum, amount: number) {
        this.grantPoolShare[pool] = this.grantPoolShare[pool]
            ? this.grantPoolShare[pool] + amount
            : amount;
    }
}
