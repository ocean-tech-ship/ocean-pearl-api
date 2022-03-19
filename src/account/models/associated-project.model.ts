import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '../../database/enums/category.enum';
import { SocialMedia } from '../../database/schemas/social-media.schema';

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

    @ApiProperty()
    accessAddresses: string[];

    @ApiProperty()
    socialMedia: SocialMedia;

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
