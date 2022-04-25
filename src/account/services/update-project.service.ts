import { Injectable } from '@nestjs/common';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { UpdatedProject } from '../models/updated-project.model';
import { Types } from 'mongoose';

@Injectable()
export class UpdateProjectService {
    public constructor(
        private projectRepository: ProjectRepository,
        private imageRepository: ImageRepository,
        private s3ImageManagementService: S3ImageManagementService,
    ) {}

    public async execute(updatedProject: UpdatedProject): Promise<void> {
        const dbProject = await this.projectRepository.findOneRaw({
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
            // Delete old logo
            if (dbProject.logo) {
                const oldLogo = await this.imageRepository.findOneRaw({
                    find: { _id: dbProject.logo },
                });

                await this.s3ImageManagementService.deleteFileOnS3(oldLogo);
                await this.imageRepository.delete({ find: { _id: oldLogo._id } });
                dbProject.logo = undefined;
            }

            // Set new logo - if present
            if (updatedProject.logo.id) {
                // TODO: We need to verify that the image has not been used yet
                const newLogo = await this.imageRepository.findOneRaw({
                    find: { id: updatedProject.logo.id },
                });

                dbProject.logo = newLogo._id;
            }
        }

        if (updatedProject.images) {
            dbProject.images = (dbProject.images as Types.ObjectId[]) ?? [];
            const oldImageIds = [...dbProject.images];

            for (const image of updatedProject.images) {
                const imageModel = await this.imageRepository.findOneRaw({
                    find: { id: image.id },
                });
                const index = oldImageIds.findIndex((id) => id.equals(imageModel._id));

                if (index > -1) {
                    // Existing image and we want to keep it
                    oldImageIds.splice(index, 1);
                } else {
                    // New image
                    // TODO: We need to verify that the image has not been used yet
                    dbProject.images.push(imageModel._id);
                }
            }

            for (const id of oldImageIds) {
                const imageModel = await this.imageRepository.findOneRaw({
                    find: { _id: id },
                });
                await this.s3ImageManagementService.deleteFileOnS3(imageModel);
                await this.imageRepository.delete({ find: { _id: id } });
                const index = dbProject.images.findIndex((el) => el.equals(id));
                dbProject.images.splice(index, 1);
            }
        }

        await this.projectRepository.update(dbProject);
    }
}
