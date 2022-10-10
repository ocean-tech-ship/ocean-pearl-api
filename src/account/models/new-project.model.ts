import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { ImageUploadService } from '../services/image-upload.service';
import { LinkedImage } from './linked-project.model';
import { formatAddresses } from '../../utils/wallet/services/address-format.service';

export class NewProject {
    @ApiProperty({
        default: "Add the project's name.",
    })
    @IsString()
    @Length(0, 64)
    title: string;

    @ApiProperty({
        default: 'Add a oneliner.',
    })
    @IsString()
    @Length(0, 128)
    oneLiner: string;

    @ApiProperty({
        default: 'Add a description.',
    })
    @IsString()
    @Length(0, 2048)
    description: string;

    @ApiProperty({
        enum: CategoryEnum,
        enumName: 'Category',
        default: CategoryEnum.Outreach,
    })
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiProperty({
        isArray: true,
    })
    @IsArray()
    @IsOptional()
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
    mediaHandles: Map<MediaHandlesEnum, string>;

    // @ApiProperty({
    //     type: CreateTeamMember,
    //     isArray: true,
    // })
    // @IsArray()
    // @ValidateNested()
    // team: CreateTeamMember[];

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
        default: 'Add a team name.',
    })
    @IsString()
    @IsOptional()
    @Length(0, 256)
    teamName: string;
}
