import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserTitleEnum } from '../enums/user-title.enum';
import { nanoid } from '../functions/nano-id.function';
import { Address, AddressSchema } from './address.schema';
import { SocialMedia, SocialMediaSchema } from './social-media.schema';

export type PearlUserType = PearlUser & Document;

@Schema({ timestamps: true })
export class PearlUser {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    id: string;

    @Prop({
        type: String,
        enum: UserTitleEnum,
    })
    title: UserTitleEnum;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 64,
    })
    firstname: string;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    lastname: string;

    @Prop({
        type: Number,
        trim: true,
        max: 128,
        min: 0,
    })
    age: number;

    @Prop({
        type: String,
    })
    userImage: string;

    @Prop({
        type: Date,
    })
    joinDate: Date;

    @Prop({
        type: Date,
    })
    activeUntil: Date;

    @Prop({
        type: AddressSchema,
    })
    address: Address;

    @Prop({
        type: SocialMediaSchema,
    })
    socialMedia: SocialMedia;
}

export const PearlUserSchema = SchemaFactory.createForClass(PearlUser);
