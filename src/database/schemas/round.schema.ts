import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { BallotTypeEnum } from '../enums/ballot-type.enum';
import { EarmarkTypeEnum } from '../enums/earmark-type.enum';
import { PaymentOptionEnum } from '../enums/payment-option.enum';
import { RemainingFundingStrategyEnum } from '../enums/remaining-funding-strategy.enum';
import { VoteTypeEnum } from '../enums/vote-type.enum';
import { nanoid } from '../functions/nano-id.function';
import { GrantPool, GrantPoolSchema } from './grant-pool.schema';
import { Funding } from './funding.schema';

export type RoundType = Round & Document;

export type GrantPoolsType = { [key in EarmarkTypeEnum]: GrantPool };

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
        type: Funding,
    })
    @ApiProperty()
    maxGrant: Funding;

    @Prop({
        type: Funding,
    })
    @ApiProperty()
    availableFunding: Funding;

    @Prop({
        type: () => new Map<EarmarkTypeEnum, GrantPool>(),
        of: GrantPoolSchema,
    })
    @ApiProperty()
    grantPools: GrantPoolsType;

    @Prop({
        type: String,
        enum: RemainingFundingStrategyEnum,
        default: RemainingFundingStrategyEnum.Recycle,
    })
    @ApiProperty()
    remainingFundingStrategy: RemainingFundingStrategyEnum;

    @Prop({
        type: String,
        enum: PaymentOptionEnum,
        default: PaymentOptionEnum.Usd,
    })
    @ApiProperty({
        enum: PaymentOptionEnum,
    })
    basisCurrency: PaymentOptionEnum;

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
        default: 0,
    })
    @ApiProperty()
    usdConversionRate: number;

    @Prop({
        type: String,
        enum: VoteTypeEnum,
        default: VoteTypeEnum.SingleChoice,
    })
    @ApiProperty({
        enum: VoteTypeEnum,
    })
    voteType: string;

    @Prop({
        type: String,
        enum: BallotTypeEnum,
        default: BallotTypeEnum.Batch,
    })
    @ApiProperty({
        enum: BallotTypeEnum,
    })
    ballotType: string;

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
