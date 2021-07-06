import { model, Schema, Document, Model, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';

export type DeliverableType = DeliverableInterface & Document;

export interface DeliverableInterface {
    _id?: Types.ObjectId;
    id?: string;
    title: string;
    description: string;
    delivered?: boolean;
}

const deliverableSchema: Schema = new Schema(
    {
        id: {
            type: String,
            default: () => nanoid(),
            unique: true,
        },
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
