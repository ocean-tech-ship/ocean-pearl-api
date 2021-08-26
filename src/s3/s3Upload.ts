import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Paths, cdnUrl } from './s3Constants';
import { readFileSync } from 'fs';
import { nanoid } from '../database/functions/nano-id.function';
const s3Bucket = process.env.S3_BUCKET;
const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const fileExtensions = {
    jpeg: 'jpeg',
    jpg: 'jpeg',
    jpe: 'jpeg',
    png: 'png',
    svg: 'svg',
};
const mimeTypes = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    jpe: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
};

export function uploadTest() {
    console.log('upload-test');
    const testImagePath = 'src/assets/test.jpg';
    const testImageData = readFileSync(testImagePath);
    const url = uploadImageToS3(testImageData, 'jpg', nanoid());
    console.log(url);
}

function uploadImageToS3(
    imageBytes,
    imageFileExtension: string,
    projectOrProposalId: string,
) {
    const imageId: string = nanoid();
    const key = `${projectOrProposalId}-${imageId}`;

    uploadFileToS3({
        data: imageBytes,
        path: s3Paths.images,
        key,
        fileExtension: imageFileExtension,
    });
    return `${cdnUrl}${key}.${fileExtensions[imageFileExtension]}`;
}

async function uploadFileToS3(params) {
    const { data, path, key, fileExtension } = params;
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
    const command = new PutObjectCommand({
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/modules/putobjectrequest.html#contenttype
        Bucket: s3Bucket,
        Body: data,
        ContentType: mimeTypes[fileExtension],
        Key: `${path}${key}.${fileExtensions[fileExtension]}`,
    });
    try {
        const response = await client.send(command);
        console.log(response);
        return true;
    } catch (error) {
        // error handling.
    } finally {
        // finally.
    }
}
