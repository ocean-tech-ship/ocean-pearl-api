import { model, Schema, Document, Types, Model } from 'mongoose';

export type SocialMediaType = SocialMediaInterface & Document;

export interface SocialMediaInterface {
    _id?: Types.ObjectId;
    website?: string;
    github?: string;
    twitter?: string;
    linkedIn?: string;
    reddit?: string;
    telegram?: string;
    facebook?: string;
    discord?: string;
}

const socialMediaSchema: Schema = new Schema({
    website: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    github: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    twitter: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    linkedIn: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    reddit: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    telegram: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    facebook: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
    discord: {
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    },
});

const SocialMedia: Model<SocialMediaType> = model<SocialMediaType>(
    'SocialMedia',
    socialMediaSchema
);

export default SocialMedia;
