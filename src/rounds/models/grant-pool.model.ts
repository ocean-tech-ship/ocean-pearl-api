import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../../database/enums/earmark-type.enum';

export interface GrantPoolProperties {
    type?: EarmarkTypeEnum;
    totalFunding?: number;
    remainingFunding?: number;
    potentialRemainingFunding?: number;
}

export class GrantPool {
    @ApiProperty({
        type: EarmarkTypeEnum,
        enum: EarmarkTypeEnum,
    })
    type: EarmarkTypeEnum;

    @ApiProperty()
    totalFunding: number;

    @ApiProperty()
    remainingFunding: number;

    @ApiProperty()
    potentialRemainingFunding?: number;

    constructor(attributes: GrantPoolProperties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}
