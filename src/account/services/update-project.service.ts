import { Injectable } from '@nestjs/common';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Image } from '../../database/schemas/image.schema';
import { UpdatedProject } from '../models/updated-project.model';

@Injectable()
export class UpdateProjectService {
    static MAX_PICTURES_AMOUNT = 8;

    public constructor(
        private projectRepository: ProjectRepository,
        private imageRepository: ImageRepository,
        private s3ImageManagementService: S3ImageManagementService,
    ) {}

    public async execute(updatedProject: UpdatedProject): Promise<void> {
        const dbProject = await this.projectRepository.findOne({
            find: { id: updatedProject.id },
        });

        dbProject.accessAddresses =
            updatedProject.accessAddresses?.map((address) => address.toLowerCase()) ??
            dbProject.accessAddresses;

        dbProject.description = updatedProject.description ?? dbProject.description;
        dbProject.oneLiner = updatedProject.oneLiner ?? dbProject.oneLiner;
        dbProject.category = updatedProject.category ?? dbProject.category;
        dbProject.socialMedia = updatedProject.socialMedia ?? dbProject.socialMedia;

        if (updatedProject.deletedImages) {
            for (const imageId of updatedProject.deletedImages) {
                for (const [index, dbImage] of dbProject.images.entries()) {
                    if (dbImage.id === imageId) {
                        await this.s3ImageManagementService.deleteFileOnS3(dbImage as Image);

                        dbProject.images.splice(index, 1);
                    }
                }
            }
        }

        if (updatedProject.newImages) {
            if (!dbProject.images) {
                dbProject.images = [];
            }

            for (const image of updatedProject.newImages) {
                const unassignedImage = await this.imageRepository.findOneRaw({
                    find: { id: image },
                });

                dbProject.images = dbProject.images as Image[];
                dbProject.images.push(unassignedImage);

                // Delete previous images if we reach the limit
                if (dbProject.images.length > UpdateProjectService.MAX_PICTURES_AMOUNT) {
                    const oldestImage = dbProject.images[0];

                    await this.s3ImageManagementService.deleteFileOnS3(oldestImage as Image);

                    dbProject.images.splice(0, 1);
                }
            }
        }

        if (updatedProject.logo) {
            if (dbProject.logo) {
                await this.s3ImageManagementService.deleteFileOnS3(dbProject.logo as Image);
            }

            const unassignedImage = await this.imageRepository.findOne({
                find: { id: updatedProject.logo },
            });

            dbProject.logo = unassignedImage;
        }

        if (updatedProject.deleteLogo) {
            await this.s3ImageManagementService.deleteFileOnS3(dbProject.logo as Image);
            dbProject.logo = undefined;
        }

        await this.projectRepository.update(dbProject);
    }
}
