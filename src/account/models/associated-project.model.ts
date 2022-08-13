import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { ReviewStatusEnum } from '../../database/enums/review-status.enum';

export class AssociatedImage {
    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;
}

export class AssociatedProject {
    @ApiProperty()
    id: string;

    @ApiProperty({
        enum: ReviewStatusEnum,
        enumName: 'ReviewStatus',
    })
    reviewStatus: ReviewStatusEnum;

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
    logo: AssociatedImage;

    @ApiProperty({
        type: AssociatedImage,
        isArray: true,
    })
    images: AssociatedImage[];

    @ApiProperty()
    teamName: string;
}
