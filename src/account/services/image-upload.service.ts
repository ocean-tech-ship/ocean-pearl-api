import { Injectable } from '@nestjs/common';
import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { Image } from '../../database/schemas/image.schema';
import { ImageOptimizationService } from '../../utils/services/image-optimization.service';
import { AssociatedImage } from '../models/associated-project.model';

@Injectable()
export class ImageUploadService {
    static IMAGE_MAX_AMOUNT = 8;
    static IMAGE_MAX_SIZE = 4000000;
    static LOGO_MAX_SIZE = 500000;

    public constructor(
        private s3ImageManagementService: S3ImageManagementService,
        private imageRepository: ImageRepository,
        private imageService: ImageOptimizationService,
    ) {}

    public async execute(image: Express.Multer.File, isLogo = false): Promise<AssociatedImage> {
        try {
            const optimizedImage = await this.imageService.optimizeImage(
                {
                    data: image.buffer,
                    type: image.mimetype as MimeTypesEnum,
                },
                isLogo,
            );

            const awsImageData = await this.s3ImageManagementService.uploadImageToS3(
                optimizedImage.data,
                optimizedImage.type,
            );

            this.imageRepository.create({
                id: awsImageData.id,
                key: awsImageData.id,
                url: awsImageData.url,
                fileExtension: awsImageData.fileExtension,
            } as Image);

            return {
                id: awsImageData.id,
                url: awsImageData.url,
            } as AssociatedImage;
        } catch (error) {
            throw error;
        }
    }
}
