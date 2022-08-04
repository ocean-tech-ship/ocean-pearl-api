import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { CryptoAddress } from '../../database/schemas/crypto-address.schema';
import { Prop } from '@nestjs/mongoose';

export class AssociatedImage {
    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;
}

export class AssociatedProject {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({
        enum: CategoryEnum,
        enumName: 'Category',
    })
    category: CategoryEnum;

    @ApiProperty({ type: CryptoAddress })
    author: CryptoAddress;
    
    @ApiProperty()
    accessAddresses: CryptoAddress[];

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
