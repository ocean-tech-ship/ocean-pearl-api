import { model, Schema, Document, Model, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';
import { nanoid } from '../functions/nano-id.function';
import { AddressInterface, addressSchema } from './address.model';
import { SocialMediaInterface, socialMediaSchema } from './social-media.model';

export type ProjectType = ProjectInterface & Document;

export interface ProjectInterface {
    _id?: Types.ObjectId;
    id?: string;
    title: string;
    description?: string;
    category: string;
    socialMedia?: SocialMediaInterface;
    logo?: string;
    pictures?: string[];
    company?: Types.ObjectId;
    daoProposals?: Types.ObjectId[];
    team?: Types.ObjectId[];
    teamName: string;    
    address?: AddressInterface;
    featured?: boolean;
}

const projectSchema: Schema = new Schema(
    {
        id: {
            type: String,
            default: () => nanoid(),
            unique: true,
        },
        title: {
            type: String,
            maxLength: 256,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: CategoryEnum,
        },
        socialMedia: {
            type: socialMediaSchema,
        },
        logo: {
            type: String,
        },
        pictures: [
            {
                type: String,
            },
        ],
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        daoProposals: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'DaoProposal',
                },
            ],
            default: void 0,
        },
        team: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'OceanUser',
                },
            ],
            default: void 0,
        },
        teamName: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: addressSchema,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Project: Model<ProjectType> = model<ProjectType>(
    'Project',
    projectSchema
);

export default Project;
