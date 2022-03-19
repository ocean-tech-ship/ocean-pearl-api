import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { EarmarkTypeEnum } from '../enums/earmark-type.enum';

@Schema({ _id: false })
export class GrantPool {
    @Prop({
        type: String,
        enum: EarmarkTypeEnum,
        required: true,
    })
    @ApiProperty({
        enum: EarmarkTypeEnum,
    })
    type: EarmarkTypeEnum;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    fundingUsd: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    fundingOcean: number;
}

export const GrantPoolSchema = SchemaFactory.createForClass(GrantPool);
