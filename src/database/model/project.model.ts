import { model, Schema, Document, Model, Types } from 'mongoose';

export type ProjectType = ProjectInterface & Document;

export interface ProjectInterface {
    _id?: Types.ObjectId,
    title: string;
    description: string;
    socialMedia?: Types.ObjectId;
    logo?: string;
    pictures?: string[];
    company?: Types.ObjectId;
    daoProposals?: Types.ObjectId[];
    team?: Types.ObjectId[];
}

const projectSchema: Schema = new Schema(
    {
        title: {
            type: String,
            maxLength: 256,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
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
        daoProposals: [
            {
                type: Schema.Types.ObjectId,
                ref: 'DaoProposal',
            },
        ],
        team: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OceanUser',
            },
        ],
    },
    { timestamps: true }
);

const Project: Model<ProjectType> = model<ProjectType>('Project', projectSchema);

export default Project;
