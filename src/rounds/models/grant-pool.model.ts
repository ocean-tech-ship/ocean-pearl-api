import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';

export class GrantPool {
    @ApiProperty({
        type: EarmarkTypeEnum,
        enum: EarmarkTypeEnum,
    })
    type: EarmarkTypeEnum;

    @ApiProperty()
    totalFunding: number;

    @ApiProperty()
    totalEffectiveVotes: number = 0

    @ApiProperty()
    remainingFunding: number;

    @ApiProperty()
    potentialRemainingFunding?: number;

    @ApiProperty()
    relevantFunding: number = 0;

    @ApiProperty()
    relevantEffectiveVotes: number = 0;

    constructor(attributes: Partial<GrantPool> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}
