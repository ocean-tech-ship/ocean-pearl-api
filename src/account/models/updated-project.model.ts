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
import { CategoryEnum } from '../../database/enums/category.enum';
import { SocialMedia } from '../../database/schemas/social-media.schema';
import { AssociatedImage } from './associated-project.model';

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
    accessAddresses: string[];

    @ApiProperty({
        type: SocialMedia,
    })
    @IsOptional()
    @IsObject()
    socialMedia: SocialMedia;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    logo: AssociatedImage;

    @ApiProperty({
        type: AssociatedImage,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(8, {
        message: 'Exceeded limit of 8 images',
    })
    images: AssociatedImage[];

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    teamName: string;
}
