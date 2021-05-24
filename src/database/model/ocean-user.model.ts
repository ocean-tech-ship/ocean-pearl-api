import { model, Schema, Document, Model, Types } from 'mongoose';
import { UserTitleEnum } from '../enums/user-title.enum';

export type OceanUserType = OceanUserInterface & Document;

export interface OceanUserInterface {
    _id?: Types.ObjectId;
    title?: UserTitleEnum;
    firstname: string;
    lastname?: string;
    age?: number;
    userImage?: string;
    joinDate: Date;
    activeUntil?: Date;
    address?: Types.ObjectId;
    socialMedia?: Types.ObjectId;
}

const oceanUserSchema: Schema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
        socialMedia: {
            type: Schema.Types.ObjectId,
            ref: 'SocialMedia',
        },
    },
    { timestamps: true }
);

const OceanUser: Model<OceanUserType> = model<OceanUserType>(
    'OceanUser',
    oceanUserSchema
);

export default OceanUser;
