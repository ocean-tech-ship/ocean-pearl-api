import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ReviewStatusEnum } from '../../database/enums/review-status.enum';
import { formatAddress } from '../../utils/wallet/services/address-format.service';
import { LinkedImage } from './linked-project.model';

export class LinkedPost {
    @ApiProperty()
    id: string;

    @ApiProperty({
        enum: ReviewStatusEnum,
    })
    reviewStatus: ReviewStatusEnum = ReviewStatusEnum.Accepted;

    @ApiProperty()
    @Transform(({ value }) => formatAddress(value))
    author: String;

    @ApiProperty()
    title: string;

    @ApiProperty()
    text: string;

    @ApiProperty({
        type: LinkedImage,
        isArray: true,
    })
    images: LinkedImage[];

    @ApiProperty()
    createdAt: Date;

    public constructor(attributes: Partial<LinkedPost>) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}
