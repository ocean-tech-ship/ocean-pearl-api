import { Injectable } from '@nestjs/common';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { UpdatedProject } from '../models/updated-project.model';

@Injectable()
export class UpdateProjectService {
    public constructor(
        private projectRepository: ProjectRepository,
        private s3ImageManagementService: S3ImageManagementService,
    ) {}

    public async execute(updatedProject: UpdatedProject): Promise<void> {
        const dbProject = await this.projectRepository.findOneRaw({
            find: { id: updatedProject.id },
        });

        if (updatedProject.deletedPictures) {
            for (const pictureKey of updatedProject.deletedPictures) {
                for (const [index, dbPicture] of dbProject.pictures.entries()) {
                    if (dbPicture.key === pictureKey) {
                        this.s3ImageManagementService.deleteFileOnS3(dbPicture);

                        dbProject.pictures.splice(index, 1);
                    }
                }
            }
        }

        if (updatedProject.newPictures) {
            for (const picture of updatedProject.newPictures) {
                dbProject.pictures.push(
                    this.s3ImageManagementService.uploadImageToS3(
                        picture.data,
                        picture.fileExtension,
                        dbProject.id,
                    ),
                );
            }
        }

        if (updatedProject.logo) {
            this.s3ImageManagementService.deleteFileOnS3(dbProject.logo);
            this.s3ImageManagementService.uploadImageToS3(
                updatedProject.logo.data,
                updatedProject.logo.fileExtension,
                dbProject.id,
            );
        }
    }
}
