import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../../database/schemas/image.schema';

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
    logo?: Image;

    @ApiProperty()
    title: string;

    constructor(attributes: LeaderboardProjectProperties = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
