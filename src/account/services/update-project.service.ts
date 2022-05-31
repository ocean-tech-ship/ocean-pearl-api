import { Injectable, UnauthorizedException } from '@nestjs/common';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { UpdatedProject } from '../models/updated-project.model';
import { Types } from 'mongoose';
import { ImageAssociationService } from '../../utils/services/image-association.service';
import { Project } from '../../database/schemas/project.schema';

@Injectable()
export class UpdateProjectService {
    public constructor(
        private projectRepository: ProjectRepository,
        private imageRepository: ImageRepository,
        private s3ImageManagementService: S3ImageManagementService,
        private imageAssociationService: ImageAssociationService,
    ) {}

    public async execute(updatedProject: UpdatedProject): Promise<void> {
        let dbProject = await this.projectRepository.findOneRaw({
            find: { id: updatedProject.id },
        });

        dbProject.accessAddresses =
            updatedProject.accessAddresses?.map((address) => address.toLowerCase()) ??
            dbProject.accessAddresses;

        dbProject.description = updatedProject.description ?? dbProject.description;
        dbProject.oneLiner = updatedProject.oneLiner ?? dbProject.oneLiner;
        dbProject.category = updatedProject.category ?? dbProject.category;
        dbProject.socialMedia = updatedProject.socialMedia ?? dbProject.socialMedia;

        dbProject = await this.updateLogo(dbProject, updatedProject);
        dbProject = await this.updateImages(dbProject, updatedProject);

        await this.projectRepository.update(dbProject);
    }

    private async updateLogo(dbProject: Project, updatedProject: UpdatedProject): Promise<Project> {
        if (updatedProject.logo) {
            if (dbProject.logo) {
                const oldLogo = await this.imageRepository.findOneRaw({
                    find: { _id: dbProject.logo as Types.ObjectId },
                });

                await this.s3ImageManagementService.deleteFileOnS3(oldLogo);
                await this.imageRepository.delete({ find: { _id: oldLogo._id } });
                dbProject.logo = null;
            }

            if (Object.keys(updatedProject.logo).length !== 0) {
                const newLogo = await this.imageRepository.findOneRaw({
                    find: { id: updatedProject.logo.id },
                });

                if (!(await this.imageAssociationService.isImageUnassociated(newLogo))) {
                    throw new UnauthorizedException(
                        'New logo already belongs to a different project',
                    );
                }

                dbProject.logo = newLogo._id;
            }
        }

        return dbProject;
    }

    private async updateImages(
        dbProject: Project,
        updatedProject: UpdatedProject,
    ): Promise<Project> {
        if (updatedProject.images) {
            dbProject.images = (dbProject.images as Types.ObjectId[]) ?? [];
            const oldImages = [...dbProject.images] as Types.ObjectId[];
            const newImages = [] as Types.ObjectId[];

            for (const image of updatedProject.images) {
                const newImage = await this.imageRepository.findOneRaw({
                    find: { id: image.id },
                });

                if (
                    !(await this.imageAssociationService.isImageUnassociated(newImage)) &&
                    !(await this.imageAssociationService.isProjectPictureOwner(dbProject, newImage))
                ) {
                    throw new UnauthorizedException(
                        'New image already belongs to a different project',
                    );
                }

                newImages.push(newImage._id);
            }

            for (const oldImageId of oldImages) {
                let deleteOldImage: boolean = true;
                for (const newImageId of newImages) {
                    if (newImageId.toString() === oldImageId.toString()) {
                        deleteOldImage = false;
                    }
                }

                if (!deleteOldImage) {
                    continue;
                }

                const imageModel = await this.imageRepository.findOneRaw({
                    find: { _id: oldImageId },
                });
                await this.s3ImageManagementService.deleteFileOnS3(imageModel);
                await this.imageRepository.delete({ find: { _id: oldImageId } });
            }

            dbProject.images = newImages;
        }

        return dbProject;
    }
}
