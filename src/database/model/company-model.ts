import { Model, model, Schema, Document } from 'mongoose';
import { AddressInterface } from './address-model';
import { JobInterface } from './job-model';
import { ProjectInterface } from './project-model';

export interface CompanyInterface extends Document {
    name: string,
    email: string,
    telefone: string,
    address?: AddressInterface['_id'],
    projects?: ProjectInterface['_id'][],
    jobs?: JobInterface['_id'][],
};

const companySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    telefone: {
        type: Number
    },
    address: {
        type: Schema.Types.ObjectId
    },
    projects: {
        type: Array
    },
    jobs: {
        type: Array
    }
});

export const Company: Model<CompanyInterface> = model('Project', companySchema);