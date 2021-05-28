import { model, Schema, Document, Types, Model } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { DaoProposalStatusEnum } from '../enums/dao-proposal-status.enum';

export type DaoProposalType = DaoProposalInterface & Document;

export interface DaoProposalInterface {
    _id?: Types.ObjectId;
    startDate: Date;
    finishDate: Date;
    fundingRound: number;
    project: Types.ObjectId;
    votes: number;
    counterVotes: number;
    requestedGrantUSD?: number;
    requestedGrantToken?: number;
    grantAmountUSD?: number;
    grantAmountToken?: number;
    status: DaoProposalStatusEnum;
    walletAddress: string;
    title: string;
    description: string;
    category: string;
    oceanProtocalPortLink: string;
    deliverables: Types.ObjectId[];
    kpiTargets: Types.ObjectId[];
    kpiRoi: string;
    images?: string[];
}

const daoProposalSchema: Schema = new Schema(
    {
        startDate: {
            type: Date,
            required: true,
        },
        finishDate: {
            type: Date,
            required: true,
        },
        fundingRound: {
            type: Number,
            required: true,
            min: 0,
            max: 9999,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        votes: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        counterVotes: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        requestedGrantUSD: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        requestedGrantToken: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        grantAmountUSD: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        grantAmountToken: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: DaoProposalStatusEnum,
            required: true,
            default: DaoProposalStatusEnum.FundingRoundActive,
        },
        walletAddress: {
            type: String,
            required: true,
            trim: true,
            maxLength: 64,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 256,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: CategoryEnum,
            required: true,
        },
        oceanProtocalPortLink: {
            type: String,
            required: true,
            trim: true,
        },
        deliverables: {
            type: [
                {
                    type: Types.ObjectId,
                    ref: 'Deliverable',
                },
            ],
            default: void 0,
            required: true,
        },
        kpiTargets: {
            type: [
                {
                    type: Types.ObjectId,
                    ref: 'KpiTarget',
                },
            ],
            default: void 0,
            required: true,
        },
        kpiRoi: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

const DaoProposal: Model<DaoProposalType> = model<DaoProposalType>(
    'DaoProposal',
    daoProposalSchema
);

export default DaoProposal;
