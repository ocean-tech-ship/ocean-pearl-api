import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { DaoProposalStatusEnum } from '../enums/dao-proposal-status.enum';
import { EarmarkTypeEnum } from '../enums/earmark-type.enum';
import { FundamentalMetricEnum } from '../enums/fundamental-metric.enum';
import { StandingEnum } from '../enums/standing.enum';
import { nanoid } from '../functions/nano-id.function';
import { PaginatePlugin } from '../plugins/pagination.plugin';
import { Deliverable } from './deliverable.schema';
import { Funding, FundingSchema } from './funding.schema';
import { Picture, PictureSchema } from './picture.schema';
import { Project } from './project.schema';
import { Round } from './round.schema';

export type DaoProposalType = DaoProposal & Document;

@Schema({ timestamps: true })
export class DaoProposal {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        unique: true,
    })
    airtableId: string;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    @ApiProperty()
    id: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'Round',
        required: true,
    })
    @ApiProperty({
        type: Round,
    })
    fundingRound: Round | Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
    })
    @ApiProperty({
        type: Project,
    })
    project: Project | Types.ObjectId;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    yesVotes: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    noVotes: number;

    @Prop({
        type: FundingSchema,
    })
    @ApiProperty()
    requestedFunding: Funding;

    @Prop({
        type: FundingSchema,
    })
    @ApiProperty()
    minimumRequestedFunding: Funding;

    @Prop({
        type: FundingSchema,
    })
    @ApiProperty()
    receivedFunding: Funding;

    @Prop({
        type: String,
        enum: DaoProposalStatusEnum,
        required: true,
        default: DaoProposalStatusEnum.Unknown,
    })
    @ApiProperty()
    status: DaoProposalStatusEnum;

    @Prop({
        type: String,
        trim: true,
        maxLength: 256,
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
    })
    @ApiProperty()
    category: string;

    @Prop({
        type: String,
        enum: EarmarkTypeEnum,
    })
    @ApiProperty()
    earmark: EarmarkTypeEnum;

    @Prop({
        type: String,
        enum: StandingEnum,
        default: StandingEnum.Unreported,
    })
    standing: StandingEnum;

    @Prop({
        type: String,
        trim: true,
    })
    @ApiProperty()
    oceanProtocolPortUrl: string;

    @Prop({
        type: String,
        trim: true,
        maxLength: 64,
    })
    @ApiProperty()
    walletAddress: string;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Deliverable',
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: Deliverable,
        isArray: true,
    })
    deliverables: Deliverable[] | Types.ObjectId[];

    @Prop({
        type: String,
        trim: true,
        default: FundamentalMetricEnum.Other,
    })
    @ApiProperty()
    fundamentalMetric: string;

    @Prop({
        type: String,
        trim: true,
    })
    @ApiProperty()
    ipfsHash: string;

    @Prop({
        type: Number,
    })
    @ApiProperty()
    snapshotBlock: number;

    @Prop({
        type: String,
        trim: true,
    })
    @ApiProperty()
    voteUrl: string;

    @Prop({
        type: [PictureSchema],
        default: [],
    })
    @ApiProperty()
    pictures: Picture[];

    createdAt: Date;

    updatedAt: Date;
}

export const DaoProposalSchema = SchemaFactory.createForClass(DaoProposal).plugin(PaginatePlugin);
