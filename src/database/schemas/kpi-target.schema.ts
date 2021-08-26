import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';

export type KpiTargetType = KpiTarget & Document;

@Schema({ timestamps: true })
export class KpiTarget {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    @ApiProperty()
    id: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 256,
    })
    @ApiProperty()
    title: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 4096,
    })
    @ApiProperty()
    description: string;
}

export const KpiTargetSchema = SchemaFactory.createForClass(KpiTarget);
