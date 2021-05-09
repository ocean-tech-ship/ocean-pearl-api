import { model, Schema, Document, Types, Model } from 'mongoose';
import { CountryEnum } from '../enums/country.enum';

export type AddressType = AddressInterface & Document;

export interface AddressInterface {
    _id?: Types.ObjectId;
    street?: string;
    streetNumber?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: CountryEnum;
}

const addressSchema: Schema = new Schema({
    street: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 256,
    },
    streetNumber: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 8,
    },
    city: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 256,
    },
    state: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 64,
    },
    zipCode: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 16,
    },
    country: {
        type: String,
        trim: true,
        uppercase: true,
        maxLength: 4,
    },
});

const Address: Model<AddressType> = model<AddressType>(
    'Address',
    addressSchema
);

export default Address;
