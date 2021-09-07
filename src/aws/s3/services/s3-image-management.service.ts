import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from '../../../database/functions/nano-id.function';
import { Picture } from '../../../database/schemas/picture.schema';
import { FileExtensionsMap } from '../constants/file-extensions-map.const';
import { MimeTypesMap } from '../constants/mime-types-map.const';
import { FileExtensionsEnum } from '../enums/file-extensions.enum';
import { MimeTypesEnum } from '../enums/mime-types.enum';
import { S3FileUploadPayload } from '../interfaces/s3-file-upload-payload.interface';

@Injectable()
export class S3ImageManagementService {
    private readonly s3Path = 'images/';
    private readonly client = new S3Client({
        region: this.configService.get<string>('S3_REGION'),
        credentials: {
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
    });

    public constructor(
        private configService: ConfigService
    ) {}

    public async uploadImageToS3(
        imageBytes: any,
        imageMimeType: MimeTypesEnum,
        projectOrProposalId: string,
    ): Promise<Picture> {
        const imageId: string = nanoid();
        const key = `${projectOrProposalId}-${imageId}`;
        const imageFileExtension = FileExtensionsMap[imageMimeType];

        try {
            await this.uploadFileToS3(imageBytes, key, imageFileExtension);

            return {
                key,
                fileExtension: imageFileExtension,
                url: `${process.env.CDN_URL}${key}.${imageFileExtension}`,  
            };
        } catch (error) {
            throw error;
        }
    }

    public async deleteFileOnS3(picture: Picture): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: `${this.s3Path}${picture.key}.${picture.fileExtension}`,
        } as DeleteObjectCommandInput)

        try {
            await this.client.send(command);
        } catch (error) {
            throw error;
        }
    }

    private async uploadFileToS3(
        data: any,
        key: string,
        fileExtension: FileExtensionsEnum,
    ): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Body: data,
            ContentType: MimeTypesMap[fileExtension],
            Key: `${this.s3Path}${key}.${fileExtension}`,
        } as S3FileUploadPayload);
        try {
            await this.client.send(command);
        } catch (error) {
            throw error;
        }
    }
}
