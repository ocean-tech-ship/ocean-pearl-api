import { model, Schema, Document } from 'mongoose';
import { ProjectInterface } from './project.model';

import mongoosePaginate = require('mongoose-paginate-v2');

export interface DaoProposalInterface extends Document {
    startDate: Date,
    finishDate: Date,
    fundingRound: number,
    project: ProjectInterface['_id']
};

const daoProposalSchema: Schema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    },
    fundingRound: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    project: {
        type: Schema.Types.ObjectId,
        required: true
    }
},
{ timestamps: true });

daoProposalSchema.plugin(mongoosePaginate);

export const DaoProposal = model('DoaProposal', daoProposalSchema);