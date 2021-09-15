import { Injectable } from '@nestjs/common';
import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { Picture } from '../../database/schemas/picture.schema';
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

        dbProject.description =
            updatedProject.description ?? dbProject.description;

        dbProject.category = updatedProject.category ?? dbProject.category;

        dbProject.socialMedia =
            updatedProject.socialMedia ?? dbProject.socialMedia;

        if (updatedProject.deletedPictures) {
            for (const pictureKey of updatedProject.deletedPictures) {
                for (const [index, dbPicture] of dbProject.pictures.entries()) {
                    if (dbPicture.key === pictureKey) {
                        await this.s3ImageManagementService.deleteFileOnS3(
                            dbPicture,
                        );

                        dbProject.pictures.splice(index, 1);
                    }
                }
            }
        }

        if (updatedProject.newPictures) {
            for (const picture of updatedProject.newPictures) {
                if (!dbProject.pictures) {
                    dbProject.pictures = [
                        await this.s3ImageManagementService.uploadImageToS3(
                            picture.buffer,
                            picture.mimetype as MimeTypesEnum,
                            dbProject.id,
                        ),
                    ];

                    break;
                }

                dbProject.pictures.push(
                    await this.s3ImageManagementService.uploadImageToS3(
                        picture.buffer,
                        picture.mimetype as MimeTypesEnum,
                        dbProject.id,
                    ),
                );
            }
        }

        if (updatedProject.logo) {
            if (dbProject.logo) {
                await this.s3ImageManagementService.deleteFileOnS3(
                    dbProject.logo,
                );
            }

            dbProject.logo = await this.s3ImageManagementService.uploadImageToS3(
                updatedProject.logo[0].buffer,
                updatedProject.logo[0].mimetype as MimeTypesEnum,
                dbProject.id,
            );
        }

        if (updatedProject.deleteLogo) {
            await this.s3ImageManagementService.deleteFileOnS3(dbProject.logo);
            dbProject.logo = {} as Picture;
        }

        await this.projectRepository.update(dbProject);
    }
}
