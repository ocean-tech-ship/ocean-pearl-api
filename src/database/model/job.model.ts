import { model, Schema, Document } from 'mongoose';
import { CountryEnum } from '../enums/country.enum';
import { TokenOptionEnum } from '../enums/token-option.enum';
import { CompanyInterface } from './company.model';

export interface JobInterface extends Document {
    title: string;
    description: string;
    location: CountryEnum;
    tokenSalaryOption?: TokenOptionEnum;
    token?: string;
    tokenAmount?: number;
    salaryFrom: number;
    salaryTo: number;
    startDate: Date;
    company: CompanyInterface['_id'];
}

const jobSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxLength: 256,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2048,
        },
        location: {
            type: String,
            require: true,
            trim: true,
            maxLength: 4,
            uppercase: true,
        },
        tokenSalaryOption: {
            type: String,
            maxLength: 4,
            required: false,
            default: 'none',
        },
        token: {
            type: String,
            maxLength: 32,
            required: false,
            default: 'none',
        },
        tokenAmount: {
            type: Number,
            required: false,
            max: 999999,
        },
        salaryFrom: {
            type: Number,
            min: 0,
            max: 999999,
        },
        salaryTo: {
            type: Number,
            min: 0,
            max: 999999,
        },
        startDate: {
            type: Date,
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
    },
    { timestamps: true }
);

const Job = model<JobInterface>('Job', jobSchema);

export default Job;
