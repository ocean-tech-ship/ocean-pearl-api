import { model, Schema, Document, Model, Types } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';

export type ProjectType = ProjectInterface & Document;

export interface ProjectInterface {
    _id?: Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    socialMedia?: Types.ObjectId;
    logo?: string;
    pictures?: string[];
    company?: Types.ObjectId;
    daoProposals?: Types.ObjectId[];
    team?: Types.ObjectId[];
    address?: Types.ObjectId;
}

const projectSchema: Schema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
            ref: 'SocialMedia',
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
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
    },
    { timestamps: true }
);

const Project: Model<ProjectType> = model<ProjectType>(
    'Project',
    projectSchema
);

export default Project;
