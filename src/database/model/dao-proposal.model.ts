import { model, Schema, Document } from 'mongoose';
import { mongoosePaginate } from 'mongoose-paginate-v2';
import { ProjectInterface } from './project.model';

export interface DaoProposalInterface extends Document {
    startDate: Date,
    finishDate: Date,
    created: Date,
    fundingRound: number,
    project: ProjectInterface['_id'][]
};

const daoProposalSchema: Schema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    fundingRound: {
        type: Number,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

daoProposalSchema.pre('save', function(this: DaoProposalInterface, next){
    if( this.created ) {
        next();
    }

    const now: Date = new Date();
    this.created = now
});

daoProposalSchema.plugin(mongoosePaginate);

export const DaoProposal = model('DoaProposal', daoProposalSchema);