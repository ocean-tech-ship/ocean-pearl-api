import { model, Schema, Document } from 'mongoose';
import { CompanyInterface } from './company.model';
import { DaoProposalInterface } from './dao-proposal.model';
import { SocialMediaInterface } from './social-media.model';

export interface ProjectInterface extends Document {
    title: string;
    description: string;
    socialMedia?: SocialMediaInterface['_id'];
    logo?: string;
    pictures?: string[];
    company?: CompanyInterface['_id'];
    daoProposals?: DaoProposalInterface['_id'][];
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
    },
    { timestamps: true }
);

const Project = model<ProjectInterface>('Project', projectSchema);

export default Project;
