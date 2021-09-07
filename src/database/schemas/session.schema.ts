import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionType = Session & Document;

@Schema({ timestamps: true })
export class Session {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    walletAddress: string;

    @Prop({
        type: Date,
        unique: true,
    })
    createdAt: Date;

    @Prop({
        type: Date,
        expires: '1w',
    })
    updatedAt: Date;

    @Prop({
        type: String,
        unique: true,
        trim: true,
        maxLength: 60,
    })
    hashedToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
