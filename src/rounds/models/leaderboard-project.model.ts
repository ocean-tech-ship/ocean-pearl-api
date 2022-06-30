import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../../database/schemas/image.schema';

export class LeaderboardProject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    completedProposals: number;

    @ApiProperty()
    logo?: Image;

    @ApiProperty()
    title: string;

    constructor(attributes: Partial<LeaderboardProject> = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
