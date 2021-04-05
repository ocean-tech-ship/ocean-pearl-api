import { model, Schema, Document } from 'mongoose';
import { CountryEnum } from '../Enums/country.enum';

export interface AddressInterface extends Document {
    street?: string,
    streetNumber?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    country?: CountryEnum
};

const addressSchema: Schema = new Schema({
    street: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 254
    },
    streetNumber: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 20
    },
    city: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 254
    },
    state: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 64
    },
    zipCode: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 16
    },
    country: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 4
    }
});

export const Address = model('Address', addressSchema);