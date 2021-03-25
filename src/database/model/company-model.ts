import { Model, model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address-model';
import { JobInterface } from './job-model';
import { ProjectInterface } from './project-model';

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    phoneNumber: string,
    socialMedia: SocialMediaInterface,
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
    creationDate: Date,
    updateDate?: Date,
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
    creationDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date
    }
});

companySchema.pre('save', function(this: CompanyInterface, next){
    const now: Date = new Date();

    this.updateDate = now;
    if( !this.creationDate ) {
        this.creationDate = now
    }

    next();
});

export const Company: Model<CompanyInterface> = model('Project', companySchema);