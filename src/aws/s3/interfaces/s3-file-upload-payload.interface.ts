import { MimeTypesEnum } from '../enums/mime-types.enum';

export interface S3FileUploadPayload {
    Bucket: string,
    Body: string,
    ContentType: MimeTypesEnum,
    Key: string,
}