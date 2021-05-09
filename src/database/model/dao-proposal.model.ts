import { model, Schema, Document, Types, Model } from 'mongoose';

export type DaoProposalType = DaoProposalInterface & Document;

export interface DaoProposalInterface {
    _id?: Types.ObjectId;
    startDate: Date;
    finishDate: Date;
    fundingRound: number;
    project: Types.ObjectId;
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
    },
    { timestamps: true }
);

const DaoProposal: Model<DaoProposalType> = model<DaoProposalType>(
    'DaoProposal',
    daoProposalSchema
);

export default DaoProposal;
