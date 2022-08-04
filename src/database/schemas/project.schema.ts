import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { MediaHandlesEnum } from '../enums/media-handles.enum';
import { OriginEnum } from '../enums/origin.enum';
import { ReviewStatusEnum } from '../enums/review-status.enum';
import { nanoid } from '../functions/nano-id.function';
import { PaginatePlugin } from '../plugins/pagination.plugin';
import { CryptoAddress } from './crypto-address.schema';
import { DaoProposal } from './dao-proposal.schema';
import { Image as Image } from './image.schema';
import { TeamMember, TeamMemberSchema } from './team-member.schema';
import { Update } from './update.schema';

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
        type: CryptoAddress
    })
    @ApiProperty()
    author: CryptoAddress;

    @Prop({
        type: String,
        enum: ReviewStatusEnum,
    })
    @ApiProperty({
        enum: ReviewStatusEnum,
    })
    reviewStatus: ReviewStatusEnum;

    @Prop({
        type: String,
        enum: OriginEnum,
    })
    @ApiProperty({
        enum: ReviewStatusEnum,
    })
    origin: OriginEnum;

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
            type: CryptoAddress,
        },
    ])
    @ApiProperty()
    associatedAddresses: CryptoAddress[] = [];

    @Prop([
        {
            type: CryptoAddress,
        },
    ])
    @ApiProperty()
    accessAddresses: CryptoAddress[] = [];

    @Prop([
        {
            type: CryptoAddress,
        },
    ])
    @ApiProperty()
    paymentAddresses: CryptoAddress[] = [];

    @Prop({
        type: () => new Map<MediaHandlesEnum, string>(),
        of: {
            type: String,
            maxLength: 128,
            trim: true,
        },
    })
    @ApiProperty()
    mediaHandles: Map<MediaHandlesEnum, string>;

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
    images: Image[] | Types.ObjectId[] = [];

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
        maxlength: 256
    })
    @ApiProperty()
    teamName: string;

    @Prop([{
        type: TeamMember,
        of: TeamMemberSchema,
    }])
    @ApiProperty()
    members: TeamMember[] = [];

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Update',
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: Update,
        isArray: true,
    })
    updates: Update[] | Types.ObjectId[];

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
