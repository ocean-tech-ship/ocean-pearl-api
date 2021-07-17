import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CurrencyEnum } from '../enums/currency.enum';
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
    id: string;

    @Prop({
        type: Number,
        min: 0,
        unique: true,
    })
    round: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    maxGrant: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    earmarked: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    availableFunding: number;

    @Prop({
        type: String,
        enum: CurrencyEnum,
        default: CurrencyEnum.Usd,
    })
    grantCurrency: CurrencyEnum;

    @Prop({
        type: Date,
        required: true,
    })
    submissionEndDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    votingStartDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    votingEndDate: Date;
}

export const RoundSchema = SchemaFactory.createForClass(Round);
