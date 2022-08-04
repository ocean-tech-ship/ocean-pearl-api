import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { ReviewStatusEnum } from '../enums/review-status.enum';
import { nanoid } from '../functions/nano-id.function';
import { PaginatePlugin } from '../plugins/pagination.plugin';
import { CryptoAddress } from './crypto-address.schema';
import { Project } from './project.schema';

export type UpdateType = Update & Document;

@Schema({ timestamps: true })
export class Update {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    @ApiProperty()
    id: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
    })
    @ApiProperty({
        type: Project,
    })
    project: Project | Types.ObjectId;

    @Prop({
        type: CryptoAddress,
        required: true,
        trim: true,
        maxLength: 256,
    })
    @ApiProperty()
    author: CryptoAddress;

    @Prop({
        type: String,
        enum: ReviewStatusEnum,
        default: ReviewStatusEnum.Pending,
    })
    @ApiProperty({
        enum: ReviewStatusEnum,
    })
    reviewStatus: ReviewStatusEnum = ReviewStatusEnum.Pending;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 256,
    })
    @ApiProperty()
    title: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxLength: 16384,
    })
    @ApiProperty()
    text: string;

    @Prop({
        type: Boolean,
        default: false,
    })
    @ApiProperty()
    images: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(attributes: Partial<Update> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}

export const UpdateSchema = SchemaFactory.createForClass(Update).plugin(PaginatePlugin);
