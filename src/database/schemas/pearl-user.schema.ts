import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty()
    id: string;

    @Prop({
        type: String,
        enum: UserTitleEnum,
    })
    @ApiProperty()
    title: UserTitleEnum;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    firstname: string;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    lastname: string;

    @Prop({
        type: Number,
        trim: true,
        max: 128,
        min: 0,
    })
    @ApiProperty()
    age: number;

    @Prop({
        type: String,
    })
    @ApiProperty()
    userImage: string;

    @Prop({
        type: Date,
    })
    @ApiProperty()
    joinDate: Date;

    @Prop({
        type: Date,
    })
    @ApiProperty()
    activeUntil: Date;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    walletAddress: string;

    @Prop({
        type: AddressSchema,
    })
    address: Address;

    @Prop({
        type: SocialMediaSchema,
    })
    @ApiProperty()
    socialMedia: SocialMedia;
}

export const PearlUserSchema = SchemaFactory.createForClass(PearlUser);
