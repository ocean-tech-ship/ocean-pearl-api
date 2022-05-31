import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { nanoid } from '../functions/nano-id.function';
import { PaginatePlugin } from '../plugins/pagination.plugin';
import { DaoProposal } from './dao-proposal.schema';
import { Image as Image } from './image.schema';
import { SocialMedia, SocialMediaSchema } from './social-media.schema';
import { TeamMember, TeamMemberSchema } from './team-member.schema';

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
        maxLength: 16384,
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

    @Prop([
        {
            type: String,
            trim: true,
            maxLength: 64,
        },
    ])
    @ApiProperty()
    associatedAddresses: string[];

    @Prop([
        {
            type: String,
            trim: true,
            maxLength: 64,
        },
    ])
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
        type: Types.ObjectId,
        ref: 'Image',
    })
    @ApiProperty({
        type: Image,
    })
    logo: Image | Types.ObjectId;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Image',
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: Image,
        isArray: true,
    })
    images: Image[] | Types.ObjectId[];

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
        isArray: true,
    })
    daoProposals: DaoProposal[] | Types.ObjectId[];

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    @ApiProperty()
    teamName: string;

    @Prop({
        type: TeamMember,
        isArray: true,
        of: TeamMemberSchema,
    })
    @ApiProperty()
    members: TeamMember[];

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

    public constructor(attributes: Partial<Project> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}

export const ProjectSchema = SchemaFactory.createForClass(Project).plugin(PaginatePlugin);
