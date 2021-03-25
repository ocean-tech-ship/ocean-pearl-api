import { Model, model, Schema, Document } from 'mongoose';
import { CompanyInterface } from './company-model';

export interface JobInterface extends Document {
    title: string,
    describtion: string,
    location: string,
    salaryFrom: number,
    salaryTo: number,
    creationDate: Date,
    startDate: Date,
    company: CompanyInterface['_id'],
};

const jobSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    describtion: {
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
        type: Number,
    },
    salaryTo: {
        type: Number,
    },
    creationDate: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export const Job: Model<JobInterface> = model('Project', jobSchema);