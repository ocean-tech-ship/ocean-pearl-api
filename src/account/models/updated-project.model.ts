import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsBooleanString,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';
import { SocialMedia } from '../../database/schemas/social-media.schema';

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
    logo: string;

    @ApiProperty()
    @IsOptional()
    @IsBooleanString()
    deleteLogo: boolean;

    @ApiProperty({
        type: String,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    deletedImages: string[];

    @ApiProperty({
        type: String,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    newImages: string[];

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    teamName: string;
}
