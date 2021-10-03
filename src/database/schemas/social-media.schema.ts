import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class SocialMedia {
    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    website: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    github: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    twitter: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    linkedIn: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    reddit: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    telegram: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    facebook: string;

    @Prop({
        type: String,
        maxLength: 128,
        trim: true,
    })
    @ApiProperty()
    discord: string;
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);
