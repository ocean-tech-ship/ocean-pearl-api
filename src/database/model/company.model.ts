import { model, Schema, Document, Types, Model } from 'mongoose';

export type CompanyType = CompanyInterface & Document;

export interface CompanyInterface {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    socialMedia?: Types.ObjectId;
    address?: Types.ObjectId;
    projects?: Types.ObjectId[];
    jobs?: Types.ObjectId[];
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

const Company: Model<CompanyType> = model<CompanyType>(
    'Company',
    companySchema
);

export default Company;
