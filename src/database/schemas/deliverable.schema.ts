import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';

export type DeliverableType = Deliverable & Document;

@Schema({ timestamps: true })
export class Deliverable {
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

    @Prop({
        type: Boolean,
        default: false,
    })
    @ApiProperty()
    delivered: boolean;
}

export const DeliverableSchema = SchemaFactory.createForClass(Deliverable);
