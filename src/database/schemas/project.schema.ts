import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { nanoid } from '../functions/nano-id.function';
import { Picture, PictureSchema } from './picture.schema';
import { Company } from './company.schema';
import { DaoProposal } from './dao-proposal.schema';
import { PearlUser } from './pearl-user.schema';
import { SocialMedia, SocialMediaSchema } from './social-media.schema';

export type ProjectType = Project & Document;

@Schema({ timestamps: true })
export class Project {
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
        maxLength: 256,
        required: true,
        unique: true,
        trim: true,
    })
    @ApiProperty()
    title: string;

    @Prop({
        type: String,
        trim: true,
        maxLength: 2048,
    })
    @ApiProperty()
    oneLiner: string;

    @Prop({
        type: String,
        trim: true,
        maxLength: 4096,
    })
    @ApiProperty()
    description: string;

    @Prop({
        type: String,
        enum: CategoryEnum,
        default: CategoryEnum.Other,
    })
    @ApiProperty()
    category: string;

    @Prop([{
        type: String,
        trim: true,
        maxLength: 64,
    }])
    @ApiProperty()
    associatedAddresses: string[];

    @Prop([{
        type: String,
        trim: true,
        maxLength: 64,
    }])
    @ApiProperty()
    accessAddresses: string[];

    @Prop([
        {
            type: String,
            trim: true,
            maxLength: 64,
        },
    ])
    @ApiProperty()
    paymentWalletsAddresses: string[];

    @Prop({
        type: SocialMediaSchema,
    })
    @ApiProperty()
    socialMedia: SocialMedia;

    @Prop({
        type: Picture,
    })
    @ApiProperty()
    logo: Picture;

    @Prop({
        type: [PictureSchema],
        default: [],
    })
    @ApiProperty()
    pictures: Picture[];

    @Prop({
        type: Types.ObjectId,
        ref: 'Company',
    })
    company: Company | Types.ObjectId;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'DaoProposal',
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: DaoProposal,
        isArray: true
    })
    daoProposals: DaoProposal[] | Types.ObjectId[];

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'PearlUser',
            },
        ],
        default: void 0,
    })
    team: PearlUser[] | Types.ObjectId[];

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    @ApiProperty()
    teamName: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    @ApiProperty()
    featured: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
