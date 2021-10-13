import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { PaymentOptionEnum } from '../enums/payment-option.enum';
import { nanoid } from '../functions/nano-id.function';

export type RoundType = Round & Document;

@Schema({ timestamps: true })
export class Round {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    @ApiProperty()
    id: string;

    @Prop({
        type: Number,
        min: 0,
        unique: true,
    })
    @ApiProperty()
    round: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    maxGrantOcean: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    maxGrantUsd: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    earmarkedFundingOcean: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    earmarkedFundingUsd: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    availableFundingOcean: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    availableFundingUsd: number;

    @Prop({
        type: String,
        enum: PaymentOptionEnum,
        default: PaymentOptionEnum.Usd,
    })
    @ApiProperty({
        enum: PaymentOptionEnum,
    })
    paymentOption: PaymentOptionEnum;

    @Prop({
        type: Number,
        min: 0,
    })
    usdConversionRate: Number;

    @Prop({
        type: Date,
    })
    @ApiProperty()
    startDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    @ApiProperty()
    submissionEndDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    @ApiProperty()
    votingStartDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    @ApiProperty()
    votingEndDate: Date;
}

export const RoundSchema = SchemaFactory.createForClass(Round);
