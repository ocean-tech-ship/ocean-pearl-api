import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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

                imageCleanupCounter++;
            }
        }

        this.logger.log(`Finish image cleanup. ${imageCleanupCounter} images removed!`);
    }

    private async getImagesForCleanup(): Promise<Image[]> {
        const yesterday: Date = new Date(new Date().getDay() - 1);
        const lastWeek: Date = new Date(new Date().getDay() - 7);

        return await this.imageRepository.getAll({
            find: {
                createdAt: { $and: [{$lte: yesterday}, {$gte: lastWeek}] },
            },
        });
    }
}
