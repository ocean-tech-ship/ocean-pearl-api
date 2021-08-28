import { Module } from '@nestjs/common';
import { S3ImageManagementService } from './s3/services/s3-image-management.service';

@Module({
    exports: [S3ImageManagementService],
})
export class AwsModule {}
