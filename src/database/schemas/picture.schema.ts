import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { FileExtensionsEnum } from '../../aws/s3/enums/file-extensions.enum';

@Schema({ _id: false })
export class Picture {

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
        type: FileExtensionsEnum,
        required: true,
    })
    @ApiProperty()
    fileExtension: FileExtensionsEnum;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);