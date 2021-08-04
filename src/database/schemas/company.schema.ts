import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';
import { Address, AddressSchema } from './address.schema';
import { Job } from './job.schema';
import { Project } from './project.schema';
import { SocialMedia, SocialMediaSchema } from './social-media.schema';

export type CompanyType = Company & Document;

@Schema({ timestamps: true })
export class Company {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    id: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 256,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    })
    email: string;

    @Prop({
        type: String,
    })
    phoneNumber: string;

    @Prop({
        type: SocialMediaSchema,
    })
    socialMedia: SocialMedia;

    @Prop({
        type: AddressSchema,
    })
    address: Address;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Project',
            },
        ],
    })
    projects: Project[];

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: 'Job',
            },
        ],
    })
    jobs: Job[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
