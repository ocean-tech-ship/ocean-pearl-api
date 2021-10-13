import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';

export class PictureData {
    data: Buffer;
    type: MimeTypesEnum;
    width?: number;
    height?: number;
    size?: number;
}
