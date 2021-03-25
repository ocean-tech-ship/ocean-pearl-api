import { Model, model, Schema, Document } from 'mongoose';

export interface ProjectInterface extends Document {
    title: string,
    description: string,
    link: string,
    logo?: string,
    pictures?: string[],
    startDate: Date,
    finishDate: Date,
    creationDate: Date,
    updateDate?: Date,
};

const projectSchema: Schema = new Schema({
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
    company: {
        type: Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date
    }
});

projectSchema.pre('save', function(this: ProjectInterface, next){
    const now: Date = new Date();

    this.updateDate = now;
    if( !this.creationDate ) {
        this.creationDate = now
    }

    next();
});

export const Project: Model<ProjectInterface> = model('Project', projectSchema);