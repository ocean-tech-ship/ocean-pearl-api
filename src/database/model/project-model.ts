import { Model, model, Schema, Document } from 'mongoose';

export interface ProjectInterface extends Document {
    title: string,
    describtion: string,
    link: string,
    logo?: string,
    pictures?: string[],
    creationDate: Date,
    startDate: Date,
    finishDate: Date,
};

const projectSchema: Schema = new Schema({
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
    link: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    pictures: {
        type: Array
    },
    creationDate: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    }
});

export const Project: Model<ProjectInterface> = model('Project', projectSchema);