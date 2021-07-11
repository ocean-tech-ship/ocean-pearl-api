import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
    id: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 256,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    description: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    delivered: boolean;
}

export const DeliverableSchema = SchemaFactory.createForClass(Deliverable);
