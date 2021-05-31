import { model, Schema, Document, Model, Types } from 'mongoose';

export type DeliverableType = DeliverableInterface & Document;

export interface DeliverableInterface {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    daoProposal: Types.ObjectId;
    delivered?: boolean;
}

const deliverableSchema: Schema = new Schema(
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
        },
        daoProposal: {
            type: Types.ObjectId,
            ref: 'DaoProposal',
            required: true,
        },
        delivered: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Deliverable: Model<DeliverableType> = model<DeliverableType>(
    'Deliverable',
    deliverableSchema
);

export default Deliverable;
