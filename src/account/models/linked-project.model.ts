import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { ReviewStatusEnum } from '../../database/enums/review-status.enum';
import { OriginEnum } from '../../database/enums/origin.enum';

export class LinkedImage {
    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;
}

export class LinkedProject {
    @ApiProperty()
    id: string;

    @ApiProperty({
        enum: ReviewStatusEnum,
        enumName: 'ReviewStatus',
    })
    reviewStatus: ReviewStatusEnum;

    @ApiProperty({
        enum: OriginEnum,
        enumName: 'Origin',
    })
    origin: OriginEnum;

    @ApiProperty()
    title: string;

    @ApiProperty()
    oneLiner: string;

    @ApiProperty()
    description: string;

    @ApiProperty({
        enum: CategoryEnum,
        enumName: 'Category',
    })
    category: CategoryEnum;

    @ApiProperty()
    author: string;

    @ApiProperty()
    accessAddresses: string[];

    @ApiProperty({
        type: Object,
        additionalProperties: {
            type: 'string',
        },
    })
    mediaHandles: Map<MediaHandlesEnum, string>;

    @ApiProperty()
    logo: LinkedImage;

    @ApiProperty({
        type: LinkedImage,
        isArray: true,
    })
    images: LinkedImage[];

    @ApiProperty()
    teamName: string;
}
