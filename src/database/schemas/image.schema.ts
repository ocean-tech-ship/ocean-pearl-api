import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, Document } from 'mongoose';
import { FileExtensionsEnum } from '../../aws/s3/enums/file-extensions.enum';
import { nanoid } from '../functions/nano-id.function';

export type ImageType = Image & Document;

@Schema({ timestamps: true })
export class Image {
    _id: Types.ObjectId;

    @Prop({
        type: String,
        default: () => nanoid(),
        unique: true,
    })
    @ApiProperty()
    id: string;

    @Prop({
        type: String,
        maxLength: 32,
        required: true,
    })
    @ApiProperty()
    key: string;

    @Prop({
        type: String,
        maxLength: 128,
        required: true,
    })
    @ApiProperty()
    url: string;

    @Prop({
        type: String,
        enum: FileExtensionsEnum,
        required: true,
    })
    @ApiProperty()
    fileExtension: FileExtensionsEnum;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
