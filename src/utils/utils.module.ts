import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';
import { ImageAssociationService } from './services/image-association.service';
import { ImageCleanupService } from './services/image-cleanup.service';
import { ImageOptimizationService } from './services/image-optimization.service';

@Module({
    imports: [DatabaseModule, AwsModule],
    providers: [ImageOptimizationService, ImageCleanupService, ImageAssociationService],
    exports: [ImageOptimizationService, ImageCleanupService, ImageAssociationService],
})
export class UtilsModule {}
