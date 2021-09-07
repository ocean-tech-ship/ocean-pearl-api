import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBooleanString,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';
import { SocialMedia } from '../../database/schemas/social-media.schema';

export class UpdatedProject {
    @ApiProperty({
        default: 'someId',
    })
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
    logo: Express.Multer.File;

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
    deletedPictures: string[];

    @ApiProperty({
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    newPictures: Express.Multer.File[];

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    teamName: string;
}
