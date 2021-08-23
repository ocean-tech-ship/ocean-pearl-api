import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SessionType = Session & Document;

@Schema({ timestamps: true })
export class Session {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    walletAddress: string;

    @Prop({
        type: Date,
        default: new Date(Date.now()),
        expires: '1w',
    })
    @ApiProperty()
    createdAt: Date;

    @Prop({
        type: String,
        trim: true,
        maxLength: 60,
    })
    @ApiProperty()
    hashedToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
