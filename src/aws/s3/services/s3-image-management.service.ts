import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { nanoid } from '../../../database/functions/nano-id.function';
import { Picture } from '../../../database/models/picture.model';
import { MimeTypesMap } from '../constants/mime-types-map.const';
import { FileExtensionsEnum } from '../enums/file-extensions.enum';
import { S3FileUploadPayload } from '../interfaces/s3-file-upload-payload.interface';

const s3Path = 'images/';
const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

@Injectable()
export class S3ImageManagementService {

    public uploadImageToS3(
        imageBytes: any,
        imageFileExtension: FileExtensionsEnum,
        projectOrProposalId: string,
    ): Picture {
        const imageId: string = nanoid();
        const key = `${projectOrProposalId}-${imageId}`;

        try {
            this.uploadFileToS3(imageBytes, key, imageFileExtension);

            return {
                key,
                fileExtension: imageFileExtension,
                url: `${process.env.CDN_URL}${key}.${imageFileExtension}`,  
            };
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
            Key: `${s3Path}${key}.${fileExtension}`,
        } as S3FileUploadPayload);
        try {
            await client.send(command);
        } catch (error) {
            throw error;
        }
    }

    private async deleteFileOnS3(picture: Picture): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: `${s3Path}${picture.key}.${picture.fileExtension}`,
        } as DeleteObjectCommandInput)

        try {
            await client.send(command);
        } catch (error) {
            throw error;
        }
    }
}
