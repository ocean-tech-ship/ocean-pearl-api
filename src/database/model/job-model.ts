import { Model, model, Schema, Document } from 'mongoose';
import { CompanyInterface } from './company-model';

export interface JobInterface extends Document {
    title: string,
    describtion: string,
    location: string,
    salaryFrom: number,
    salaryTo: number,
    creationDate: Date,
    updateDate?: Date,
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
    updateDate: {
        type: Date
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

jobSchema.pre('save', function(this: JobInterface, next){
    const now: Date = new Date();

    this.updateDate = now;
    if( !this.creationDate ) {
        this.creationDate = now
    }

    next();
});

export const Job: Model<JobInterface> = model('Project', jobSchema);