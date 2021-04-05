import { model, Schema, Document } from 'mongoose';
import { CompanyInterface } from './company.model';

import mongoosePaginate = require('mongoose-paginate-v2');

export interface JobInterface extends Document {
    title: string,
    description: string,
    location: string,
    salaryFrom: number,
    salaryTo: number,
    startDate: Date,
    company: CompanyInterface['_id'],
};

const jobSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        require: true,
        trim: true
    },
    salaryFrom: {
        type: Number
    },
    salaryTo: {
        type: Number
    },
    startDate: {
        type: Date,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true
    }
},
{ timestamps: true });

jobSchema.plugin(mongoosePaginate);

export const Job = model('Job', jobSchema);