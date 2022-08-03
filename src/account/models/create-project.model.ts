import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    Length,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { ImageUploadService } from '../services/image-upload.service';
import { AssociatedImage } from './associated-project.model';
import { CreateCryptoAddress } from './create-crypto-address.model';

export class CreateProject {
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
        type: CreateCryptoAddress,
        isArray: true,
    })
    @IsArray()
    @IsOptional()
    @ValidateNested()
    accessAddresses: CreateCryptoAddress[];

    // @ApiProperty({
    //     type: CreateCryptoAddress,
    //     isArray: true,
    // })
    // @IsArray()
    // @ValidateNested()
    // paymentAddresses: CreateCryptoAddress[];

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
    logo: AssociatedImage;

    @ApiProperty({
        type: AssociatedImage,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(ImageUploadService.IMAGE_MAX_AMOUNT, {
        message: `Exceeded limit of ${ImageUploadService.IMAGE_MAX_AMOUNT} images`,
    })
    images: AssociatedImage[];

    @ApiProperty({
        default: 'Add a team name.',
    })
    @IsString()
    @IsOptional()
    @Length(0, 256)
    teamName: string;
}
