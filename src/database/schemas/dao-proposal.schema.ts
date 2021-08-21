import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { DaoProposalStatusEnum } from '../enums/dao-proposal-status.enum';
import { nanoid } from '../functions/nano-id.function';
import { Project } from './project.schema';
import { Deliverable } from './deliverable.schema';
import { KpiTarget } from './kpi-target.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Round } from './round.schema';
import { StandingEnum } from '../enums/standing.enum';

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
    votes: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    counterVotes: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    requestedGrantToken: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    grantedToken: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    requestedGrantUsd: number;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    grantedUsd: number;

    @Prop({
        type: String,
        enum: DaoProposalStatusEnum,
        required: true,
        default: DaoProposalStatusEnum.Running,
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
        maxLength: 4096,
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
        type: [
            {
                type: Types.ObjectId,
                ref: 'KpiTarget',
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: KpiTarget,
        isArray: true,
    })
    kpiTargets: KpiTarget[] | Types.ObjectId[];

    @Prop({
        type: String,
        trim: true,
    })
    @ApiProperty()
    kpiRoi: string;

    @Prop({
        type: String,
        trim: true,
        required: true,
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

    @Prop([
        {
            type: String,
        },
    ])
    @ApiProperty()
    images: string[];

    createdAt: Date;

    updatedAt: Date;
}

export const DaoProposalSchema = SchemaFactory.createForClass(DaoProposal);
