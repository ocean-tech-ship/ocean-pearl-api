import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';
import { ImageCleanupService } from './services/image-cleanup.service';
import { ImageOptimizationService } from './services/image-optimization.service';

@Module({
    imports: [DatabaseModule, AwsModule],
    providers: [ImageOptimizationService, ImageCleanupService],
    exports: [ImageOptimizationService, ImageCleanupService],
})
export class UtilsModule {}
