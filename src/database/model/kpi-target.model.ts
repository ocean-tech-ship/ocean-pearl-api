import { model, Schema, Document, Model, Types } from 'mongoose';

export type KpiTargetType = KpiTargetInterface & Document;

export interface KpiTargetInterface {
    _id?: Types.ObjectId;
    title: string;
    descciption: string;
    daoProposal: Types.ObjectId;
}

const kpiTargetSchema: Schema = new Schema(
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
        doaProposal: {
            type: Types.ObjectId,
            ref: 'DaoProposal',
            required: true,
        },
    },
    { timestamps: true }
);

const KpiTarget: Model<KpiTargetType> = model<KpiTargetType>(
    'KpiTarget',
    kpiTargetSchema
);

export default KpiTarget;
