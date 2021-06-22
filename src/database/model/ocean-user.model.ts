import { model, Schema, Document, Model, Types } from 'mongoose';
import { UserTitleEnum } from '../enums/user-title.enum';
import { nanoid } from '../functions/nano-id.function';
import { AddressInterface, addressSchema } from './address.model';
import { SocialMediaInterface, socialMediaSchema } from './social-media.model';

export type OceanUserType = OceanUserInterface & Document;

export interface OceanUserInterface {
    _id?: Types.ObjectId;
    id?: string;
    title?: UserTitleEnum;
    firstname: string;
    lastname?: string;
    age?: number;
    userImage?: string;
    joinDate: Date;
    activeUntil?: Date;
    address?: AddressInterface;
    socialMedia?: SocialMediaInterface;
}

const oceanUserSchema: Schema = new Schema(
    {
        id: {
            type: String,
            default: () => nanoid(),
            unique: true,
        },
        title: {
            type: String,
            enum: UserTitleEnum,
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
            maxLength: 64,
        },
        lastname: {
            type: String,
            trim: true,
            maxLength: 64,
        },
        age: {
            type: Number,
            trim: true,
            max: 128,
            min: 0,
        },
        userImage: {
            type: String,
        },
        joinDate: {
            type: Date,
        },
        activeUntil: {
            type: Date,
        },
        address: {
            type: addressSchema,
        },
        socialMedia: {
            type: socialMediaSchema,
        },
    },
    { timestamps: true }
);

const OceanUser: Model<OceanUserType> = model<OceanUserType>(
    'OceanUser',
    oceanUserSchema
);

export default OceanUser;
