import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { Image } from '../../database/schemas/image.schema';
import { ImageAssociationService } from './image-association.service';

@Injectable()
export class ImageCleanupService {
    private readonly logger = new Logger(ImageCleanupService.name);

    public constructor(
        private imageRepository: ImageRepository,
        private s3ImageManagementService: S3ImageManagementService,
        private imageAssociationService: ImageAssociationService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'Image Cleanup',
        timeZone: 'Europe/Berlin',
    })
    public async execute(): Promise<void> {
        this.logger.log('Start image cleanup.');
        let imageCleanupCounter: number = 0;
        const images: Image[] = await this.getImagesForCleanup();

        for (const image of images) {
            if (await this.imageAssociationService.isImageUnassociated(image)) {
                await this.imageRepository.delete({
                    find: { _id: image._id },
                });

                await this.s3ImageManagementService.deleteFileOnS3(image);

                imageCleanupCounter++;
            }
        }

        this.logger.log(`Finish image cleanup. ${imageCleanupCounter} images removed!`);
    }

    private async getImagesForCleanup(): Promise<Image[]> {
        const yesterday: Date = new Date();
        yesterday.setDate(new Date().getDate() - 1);
        const lastWeek: Date = new Date();
        lastWeek.setDate(new Date().getDate() - 7);

        return await this.imageRepository.getAllRaw({
            find: {
                createdAt: { $lte: yesterday, $gte: lastWeek },
            },
        });
    }
}
