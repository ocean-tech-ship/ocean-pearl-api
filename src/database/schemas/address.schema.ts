import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CountryEnum } from '../enums/country.enum';

export type AddressType = Address & Document;

@Schema({ _id: false })
export class Address {
    @Prop({
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 256,
    })
    street: string;

    @Prop({
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 8,
    })
    streetNumber: string;

    @Prop({
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 256,
    })
    city: string;

    @Prop({
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 64,
    })
    state: string;

    @Prop({
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 16,
    })
    zipCode: string;

    @Prop({
        type: String,
        enum: CountryEnum,
        trim: true,
        uppercase: true,
        maxLength: 4,
    })
    country: CountryEnum;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
