import { model, Schema, Document, Types, Model } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { DaoProposalStatusEnum } from '../enums/dao-proposal-status.enum';

export type DaoProposalType = DaoProposalInterface & Document;

export interface DaoProposalInterface {
    _id?: Types.ObjectId;
    startDate?: Date;
    finishDate?: Date;
    fundingRound: number;
    project: Types.ObjectId;
    votes: number;
    counterVotes: number;
    requestedGrantUSD?: number;
    requestedGrantToken?: number;
    grantAmountUSD?: number;
    grantAmountToken?: number;
    status: DaoProposalStatusEnum;
    walletAddress?: string;
    paymentWalletsAddresses?: string[];
    title?: string;
    description: string;
    category: string;
    oceanProtocalPortUrl?: string;
    deliverables: Types.ObjectId[];
    kpiTargets?: Types.ObjectId[];
    kpiRoi?: string;
    fundamentalMetric: string;
    ipfsHash?: string;
    snapshotBlock?: number;
    voteUrl?: string;
    images?: string[];
}

const daoProposalSchema: Schema = new Schema(
    {
        startDate: {
            type: Date,
        },
        finishDate: {
            type: Date,
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
            min: 0,
            default: 0,
        },
        counterVotes: {
            type: Number,
            min: 0,
            default: 0,
        },
        requestedGrantUSD: {
            type: Number,
            min: 0,
            default: 0,
        },
        requestedGrantToken: {
            type: Number,
            min: 0,
            default: 0,
        },
        grantAmountUSD: {
            type: Number,
            min: 0,
            default: 0,
        },
        grantAmountToken: {
            type: Number,
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
            trim: true,
            maxLength: 64,
        },
        paymentWalletsAddresses: [
            {
                type: String,
                trim: true,
                maxLength: 64,
            },
        ],
        title: {
            type: String,
            trim: true,
            maxLength: 256,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: CategoryEnum,
        },
        oceanProtocalPortUrl: {
            type: String,
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
        },
        kpiTargets: {
            type: [
                {
                    type: Types.ObjectId,
                    ref: 'KpiTarget',
                },
            ],
            default: void 0,
        },
        kpiRoi: {
            type: String,
            trim: true,
        },
        fundamentalMetric: {
            type: String,
            trim: true,
            required: true,
        },
        ipfsHash: {
            type: String,
            trim: true,
        },
        snapshotBlock: {
            type: Number,
        },
        voteUrl: {
            type: String,
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
