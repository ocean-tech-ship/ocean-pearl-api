import { model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address.model';
import { JobInterface } from './job.model';
import { ProjectInterface } from './project.model';
import { SocialMediaInterface } from './social-media.model';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    phoneNumber: string,
    socialMedia?: SocialMediaInterface['_id'],
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
};

const companySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 256
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String
    },
    socialMedia: {
        type: Schema.Types.ObjectId
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