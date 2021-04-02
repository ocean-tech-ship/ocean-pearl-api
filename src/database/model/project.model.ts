import { model, Schema, Document } from 'mongoose';
import { CompanyInterface } from './company.model';
import { DaoProposalInterface } from './dao-proposal.model';

import mongoosePaginate = require('mongoose-paginate-v2');

export interface ProjectInterface extends Document {
    title: string,
    description: string,
    website?: string,
    logo?: string,
    pictures?: string[],
    company: CompanyInterface['_id'],
    daoProposals?: DaoProposalInterface['_id'][],
    created?: Date,
    updated?: Date,
};

const projectSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String
    },
    logo: {
        type: String
    },
    pictures: {
        type: Array
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true
    },
    daoProposal: {
        type: Schema.Types.ObjectId
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: {
        type: Date
    }
});

projectSchema.pre('save', function(this: ProjectInterface, next){
    this.updated = new Date();

    next();
});

projectSchema.plugin(mongoosePaginate);

export const Project = model('Project', projectSchema);