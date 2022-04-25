import { Injectable } from '@nestjs/common';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Image } from '../../database/schemas/image.schema';
import { UpdatedProject } from '../models/updated-project.model';

@Injectable()
export class UpdateProjectService {
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

        if (updatedProject.logo) {
            if (dbProject.logo) {
                await this.s3ImageManagementService.deleteFileOnS3(dbProject.logo as Image);
                delete dbProject.logo;
            }

            // Only set new image if provided
            if (updatedProject.logo.id) {
                // TODO: We need to verify that the image has not been used yet
                dbProject.logo = await this.imageRepository.findOne({
                    find: { id: updatedProject.logo.id },
                });
            }
        }

        if (updatedProject.images) {
            dbProject.images = dbProject.images ? (dbProject.images as Image[]) : [];
            const deleteImages = [...dbProject.images];

            for (const image of updatedProject.images) {
                const index = dbProject.images.findIndex((el) => el.id === image.id);

                if (index > -1) {
                    // Existing image and we want to keep it
                    deleteImages.splice(index, 1);
                } else {
                    // New image
                    // TODO: We need to verify that the image has not been used yet
                    const unassignedImage = await this.imageRepository.findOne({
                        find: { id: image.id },
                    });

                    dbProject.images.push(unassignedImage);
                }
            }

            // Delete old images which are no longer present
            for (const image of deleteImages) {
                await this.s3ImageManagementService.deleteFileOnS3(image as Image);
                const index = dbProject.images.findIndex((el) => el.id === image.id);
                dbProject.images.splice(index, 1);
            }
        }

        await this.projectRepository.update(dbProject);
    }
}
