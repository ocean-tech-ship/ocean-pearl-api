import { Model, model, Schema, Document } from 'mongoose';

export interface AddressInterface extends Document {
    street: string,
    streetNumber: number,
    city: string,
    state: string,
    zipCode: string,
    country: string
};

const addressSchema: Schema = new Schema({
    street: {
        type: String,
        trim: true
    },
    streetNumber: {
        type: Number
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    }
});

export const Address: Model<AddressInterface> = model('Project', addressSchema);