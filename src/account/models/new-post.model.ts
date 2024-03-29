import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length } from 'class-validator';
import { ImageUploadService } from '../services/image-upload.service';
import { LinkedImage } from './linked-project.model';

export class NewPost {
    @ApiProperty()
    @IsString()
    @Length(10)
    project: string;

    @ApiProperty()
    @IsString()
    @Length(1, 128)
    title: string;

    @ApiProperty()
    @IsString()
    @Length(0, 2048)
    text: string;

    @ApiProperty()
    @IsArray()
    @ArrayMaxSize(ImageUploadService.IMAGE_MAX_AMOUNT, {
        message: `Exceeded limit of ${ImageUploadService.IMAGE_MAX_AMOUNT} images`,
    })
    @IsOptional()
    images: LinkedImage[];

    constructor(attributes: Partial<NewPost> = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
