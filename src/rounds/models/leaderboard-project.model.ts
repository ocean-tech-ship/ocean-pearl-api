import { ApiProperty } from '@nestjs/swagger';

export interface LeaderboardProjectProperties {
    id?: string;
    completedProposals?: number;
    logoUrl?: string;
    title?: string;
}

export class LeaderboardProject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    completedProposals: number;

    @ApiProperty()
    logoUrl?: string;

    @ApiProperty()
    title: string;

    constructor(attributes: LeaderboardProjectProperties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}