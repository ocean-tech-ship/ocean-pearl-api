import { model, Schema, Document, Model, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';
import { AddressInterface, addressSchema } from './address.model';
import { SocialMediaInterface, socialMediaSchema } from './social-media.model';

export type CompanyType = CompanyInterface & Document;

export interface CompanyInterface {
    _id?: Types.ObjectId;
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    socialMedia?: SocialMediaInterface;
    address?: AddressInterface;
    projects?: Types.ObjectId[];
    jobs?: Types.ObjectId[];
}

const companySchema: Schema = new Schema(
    {
        id: {
            type: String,
            default: () => nanoid(),
            unique: true,
        },
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
            type: socialMediaSchema,
        },
        address: {
            type: addressSchema,
        },
        projects: [
            {
                type: Types.ObjectId,
                ref: 'Project',
            },
        ],
        jobs: [
            {
                type: Types.ObjectId,
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
