import { model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address.model';
import { JobInterface } from './job.model';
import { ProjectInterface } from './project.model';

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    phoneNumber: string,
    socialMedia: SocialMediaInterface,
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
    created?: Date,
    updated?: Date,
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
        type: Number
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
    },
    created: {
        type: Date,
        required: true
    },
    updated: {
        type: Date
    }
});

companySchema.pre('save', function(this: CompanyInterface, next){
    const now: Date = new Date();

    this.updated = now;

    if( !this.created ) {
        this.created = now
    }

    next();
});

export const Company = model('Company', companySchema);