import { model, Schema, Document, Model, Types } from 'mongoose';
import { nanoid } from '../functions/nano-id.function';

export type KpiTargetType = KpiTargetInterface & Document;

export interface KpiTargetInterface {
    _id?: Types.ObjectId;
    id?: string;
    title: string;
    description: string;
}

const kpiTargetSchema: Schema = new Schema(
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
        }
    },
    { timestamps: true }
);

const KpiTarget: Model<KpiTargetType> = model<KpiTargetType>(
    'KpiTarget',
    kpiTargetSchema
);

export default KpiTarget;
