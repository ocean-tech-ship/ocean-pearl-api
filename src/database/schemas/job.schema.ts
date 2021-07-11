import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CountryEnum } from '../enums/country.enum';
import { TokenOptionEnum } from '../enums/token-option.enum';
import { nanoid } from '../functions/nano-id.function';
import { Company } from './company.schema';

export type JobType = Job & Document;

@Schema({ timestamps: true })
export class Job {
    _id: Types.ObjectId;
    
    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    id: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 256,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 2048,
    })
    description: string;

    @Prop({
        type: String,
        enum: CountryEnum,
        require: true,
        trim: true,
        maxLength: 4,
        uppercase: true,
    })
    location: CountryEnum;

    @Prop({
        type: String,
        enum: TokenOptionEnum,
        maxLength: 4,
        required: false,
        default: 'none',
    })
    tokenSalaryOption: TokenOptionEnum;

    @Prop({
        type: String,
        maxLength: 32,
        required: false,
        default: 'none',
    })
    token: string;

    @Prop({
        type: Number,
        required: false,
        max: 999999,
    })
    tokenAmount: number;

    @Prop({
        type: Number,
        min: 0,
        max: 999999,
    })
    salaryFrom: number;

    @Prop({
        type: Number,
        min: 0,
        max: 999999,
    })
    salaryTo: number;

    @Prop({
        type: Date,
        required: true,
    })
    startDate: Date;

    @Prop({
        type: Types.ObjectId,
        ref: 'Company',
        required: true,
    })
    company: Company | Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
