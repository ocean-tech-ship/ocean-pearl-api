import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryEnum } from '../../database/enums/category.enum';
import { LinkedImage } from './linked-project.model';
import { ImageUploadService } from '../services/image-upload.service';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { formatAddresses } from '../../utils/wallet/services/address-format.service';

export class UpdatedProject {
    @ApiProperty({
        default: 'Some Id',
    })
    @IsString()
    id: string;

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({
        default: 'Add your description.',
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        default: 'Add your one liner.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(80, {
        message: 'One-Liner must be smaller than 80 characters',
    })
    oneLiner: string;

    @ApiProperty({
        enum: CategoryEnum,
        enumName: 'Category',
        default: CategoryEnum.Outreach,
    })
    @IsOptional()
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({
        message: 'At least one address must be specified',
    })
    @Transform(({ value }) => formatAddresses(value))
    accessAddresses: string[];

    @ApiProperty({
        type: Object,
        additionalProperties: {
            type: 'string',
        },
        default: {
            [MediaHandlesEnum.Twitter]: 'Oceanpearl.io',
        },
    })
    @Type(() => String)
    @MaxLength(128, {
        each: true,
    })
    @IsOptional()
    @IsObject()
    mediaHandles: Map<MediaHandlesEnum, string>;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    logo: LinkedImage;

    @ApiProperty({
        type: LinkedImage,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(ImageUploadService.IMAGE_MAX_AMOUNT, {
        message: `Exceeded limit of ${ImageUploadService.IMAGE_MAX_AMOUNT} images`,
    })
    images: LinkedImage[];

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    teamName: string;
}
