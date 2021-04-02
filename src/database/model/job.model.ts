import { model, Schema, Document } from 'mongoose';
import { mongoosePaginate } from 'mongoose-paginate-v2';
import { CompanyInterface } from './company.model';

export interface JobInterface extends Document {
    title: string,
    describtion: string,
    location: string,
    salaryFrom: number,
    salaryTo: number,
    created: Date,
    updated?: Date,
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
    created: {
        type: Date,
        required: true
    },
    updated: {
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

    this.updated = now;

    if( !this.created ) {
        this.created = now
    }

    next();
});

jobSchema.plugin(mongoosePaginate);

export const Job = model('Job', jobSchema);