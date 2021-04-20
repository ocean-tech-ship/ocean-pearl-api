import { model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address.model';
import { JobInterface } from './job.model';
import { ProjectInterface } from './project.model';
import { SocialMediaInterface } from './social-media.model';

export interface CompanyInterface extends Document {
    name: string;
    email: string;
    phoneNumber: string;
    socialMedia?: SocialMediaInterface['_id'];
    address?: AddressInterface['_id'];
    projects?: ProjectInterface['_id'][];
    jobs?: JobInterface['_id'][];
}

const companySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 256,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
        },
        socialMedia: {
            type: Schema.Types.ObjectId,
            ref: 'SocialMedia',
        },
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        jobs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
    },
    { timestamps: true }
);

const Company = model<CompanyInterface>('Company', companySchema);

export default Company;
