import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class SocialMedia {
    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    website: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    github: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    twitter: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    linkedIn: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    reddit: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    telegram: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    facebook: string;

    @Prop({
        type: String,
        maxLength: 64,
        trim: true,
        lowercase: true,
    })
    @ApiProperty()
    discord: string;
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);
