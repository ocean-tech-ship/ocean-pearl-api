import { model, Schema, Document } from 'mongoose';
import { ProjectInterface } from './project.model';

import mongoosePaginate = require('mongoose-paginate-v2');

export interface DaoProposalInterface extends Document {
    startDate: Date,
    finishDate: Date,
    created?: Date,
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
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    fundingRound: {
        type: Number,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

daoProposalSchema.plugin(mongoosePaginate);

export const DaoProposal = model('DoaProposal', daoProposalSchema);