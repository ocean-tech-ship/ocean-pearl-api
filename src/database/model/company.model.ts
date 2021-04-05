import { model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address.model';
import { JobInterface } from './job.model';
import { ProjectInterface } from './project.model';

import mongoosePaginate = require('mongoose-paginate-v2');

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    phoneNumber: string,
    socialMedia: SocialMediaInterface,
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
};

export interface SocialMediaInterface {
    website?: string,
    github?: string,
    twitter?: string,
    linkedIn?: string,
    reddit?: string,
    telegram?: string,
    facebook?: string,
    discord?: string,
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
    phoneNumber: {
        type: String
    },
    socialMedia: {
        type: Object
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
},
{ timestamps: true });

companySchema.plugin(mongoosePaginate);

export const Company = model('Company', companySchema);