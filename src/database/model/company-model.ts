import { Model, model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address-model';
import { JobInterface } from './job-model';
import { ProjectInterface } from './project-model';

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    telefone: string,
    website?: string,
    github?: string,
    twitter?: string,
    linkedIn?: string,
    reddit?: string,
    telegram?: string,
    facebook?: string,
    discord?: string,
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
};

const companySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    telefone: {
        type: Number
    },
    website: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    },
    linkedIn: {
        type: String,
        trim: true
    },
    reddit: {
        type: String,
        trim: true
    },
    telegram: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    discord: {
        type: String,
        trim: true
    },
    address: {
        type: Schema.Types.ObjectId
    },
    projects: {
        type: Array
    },
    jobs: {
        type: Array
    }
});

export const Company: Model<CompanyInterface> = model('Project', companySchema);