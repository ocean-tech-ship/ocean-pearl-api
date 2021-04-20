import { model, Schema, Document } from 'mongoose';
import { ProjectInterface } from './project.model';

export interface DaoProposalInterface extends Document {
    startDate: Date;
    finishDate: Date;
    fundingRound: number;
    project: ProjectInterface['_id'];
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

const DaoProposal = model<DaoProposalInterface>(
    'DaoProposal',
    daoProposalSchema
);

export default DaoProposal;
