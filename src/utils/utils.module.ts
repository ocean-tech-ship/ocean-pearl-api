import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ImageCleanupService } from './services/image-cleanup.service';
import { ImageOptimizationService } from './services/image-optimization.service';

@Module({
    imports: [DatabaseModule],
    providers: [ImageOptimizationService, ImageCleanupService],
    exports: [ImageOptimizationService, ImageCleanupService],
})
export class UtilsModule {}
