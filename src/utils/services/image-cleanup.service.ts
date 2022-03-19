import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { DaoProposalRepository } from '../../database/repositories/dao-proposal.repository';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Image } from '../../database/schemas/image.schema';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class ImageCleanupService {
    private readonly logger = new Logger(ImageCleanupService.name);

    public constructor(
        private imageRepository: ImageRepository,
        private projectRepository: ProjectRepository,
        private proposalRepository: DaoProposalRepository,
        private s3ImageManagementService: S3ImageManagementService,
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
            const associatedProject: Project = await this.projectRepository.findOneRaw({
                find: {
                    $or: [{ logo: image._id }, { images: image._id }],
                },
            });

            const associatedProposal: DaoProposal = await this.proposalRepository.findOneRaw({
                find: { images: image._id },
            });

            if (!associatedProject && !associatedProposal) {
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
        yesterday.setDate(new Date().getDate() - 1)
        const lastWeek: Date = new Date();
        lastWeek.setDate(new Date().getDate() - 7)
        
        return await this.imageRepository.getAllRaw({
            find: {
                createdAt: { $lte: yesterday, $gte: lastWeek },
            },
        });
    }
}
