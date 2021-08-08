import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SocialMedia {
    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    website: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    github: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    twitter: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    linkedIn: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    reddit: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    telegram: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    facebook: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    discord: string;
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);
