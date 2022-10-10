import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { formatAddress } from '../../utils/wallet/services/address-format.service';
import { ReviewStatusEnum } from '../enums/review-status.enum';
import { nanoid } from '../functions/nano-id.function';
import { PaginatePlugin } from '../plugins/pagination.plugin';
import { Image } from './image.schema';
import { Project } from './project.schema';

export type PostType = Post & Document;

@Schema({ timestamps: true })
export class Post {
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
        type: String,
        required: true,
        trim: true,
        maxLength: 42,
    })
    @ApiProperty()
    @Transform(({ value }) => formatAddress(value))
    author: String;

    @Prop({
        type: String,
        enum: ReviewStatusEnum,
        default: ReviewStatusEnum.Accepted,
    })
    @ApiProperty({
        enum: ReviewStatusEnum,
    })
    reviewStatus: ReviewStatusEnum = ReviewStatusEnum.Accepted;

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
        type: [
            {
                type: Types.ObjectId,
                ref: Image.name,
            },
        ],
        default: void 0,
    })
    @ApiProperty({
        type: Image,
        isArray: true,
    })
    images: Image[] | Types.ObjectId[] = [];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(attributes: Partial<Post> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}

export const PostSchema = SchemaFactory.createForClass(Post).plugin(PaginatePlugin);
