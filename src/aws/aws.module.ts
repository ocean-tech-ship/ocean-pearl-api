import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ImageManagementService } from './s3/services/s3-image-management.service';

@Module({
    imports: [ConfigModule],
    providers: [S3ImageManagementService],
    exports: [S3ImageManagementService],
})
export class AwsModule {}
