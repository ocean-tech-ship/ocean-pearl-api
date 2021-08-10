import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { nanoid } from '../functions/nano-id.function';
import { Address, AddressSchema } from './address.schema';
import { Company } from './company.schema';
import { SocialMedia, SocialMediaSchema } from './social-media.schema';
import { ApiProperty } from '@nestjs/swagger';
import { DaoProposal } from './dao-proposal.schema';
import { PearlUser } from './pearl-user.schema';

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

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    walletAddress: string;

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
        type: String,
    })
    @ApiProperty()
    logo: string;

    @Prop([
        {
            type: String,
        },
    ])
    @ApiProperty()
    pictures: string[];

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
        type: AddressSchema,
    })
    address: Address;

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
