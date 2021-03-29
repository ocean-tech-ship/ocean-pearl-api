import { model, Schema, Document } from 'mongoose';

export interface AddressInterface extends Document {
    street: string,
    streetNumber: string,
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
        type: String
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

export const Address = model('Address', addressSchema);