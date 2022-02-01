import { ApiProperty } from '@nestjs/swagger';

export interface NeededVotesPropoerties {
    fullyFunded?: number;
    partiallyFunded?: number; 
}

export class NeededVotes {
    @ApiProperty()
    fullyFunded: number;

    @ApiProperty()
    partiallyFunded?: number;

    constructor(attributes: NeededVotesPropoerties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}