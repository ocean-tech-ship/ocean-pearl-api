import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { FileExtensionsEnum } from '../../aws/s3/enums/file-extensions.enum';
import { CategoryEnum } from '../../database/enums/category.enum';
import { SocialMedia } from '../../database/schemas/social-media.schema';

export class NewPictures {
    @ApiProperty()
    @IsNotEmpty()
    data: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        enum: FileExtensionsEnum,
        enumName: 'FileExtension',
        default: FileExtensionsEnum.Jpg,
    })
    @IsEnum(FileExtensionsEnum)
    @IsNotEmpty()
    fileExtension;
}

export class UpdatedProject {
    @ApiProperty({
        default: 'someId',
    })
    @IsString()
    id: string;

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsString()
    title: string;

    @ApiProperty({
        default: 'Add your one liner.',
    })
    @IsString()
    description: string;

    @ApiProperty({
        default: 'Add your description.',
    })
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

    @ApiProperty({
        type: NewPictures,
    })
    @IsObject()
    logo: NewPictures;

    @ApiProperty({
        type: String,
        isArray: true,
    })
    @IsArray()
    deletedPictures: string[];

    @ApiProperty({
        type: NewPictures,
        isArray: true,
    })
    @IsArray()
    newPictures: NewPictures[];

    @ApiProperty({
        default: 'Ocean Pearl',
    })
    @IsOptional()
    @IsString()
    teamName: string;
}
