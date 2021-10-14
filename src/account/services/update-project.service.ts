import { Injectable } from '@nestjs/common';
import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';
import { S3ImageManagementService } from '../../aws/s3/services/s3-image-management.service';
import { Picture } from '../../database/schemas/picture.schema';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { UpdatedProject } from '../models/updated-project.model';
import { PicturesService } from '../../utils/services/pictures.service';

@Injectable()
export class UpdateProjectService {
    static MAX_PICTURES_SIZE = 8;

    public constructor(
        private projectRepository: ProjectRepository,
        private picturesService: PicturesService,
        private s3ImageManagementService: S3ImageManagementService,
    ) {}

    public async execute(
        id: string,
        updatedProject: UpdatedProject,
    ): Promise<void> {
        const dbProject = await this.projectRepository.findOneRaw({
            find: { id: id },
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
            if (!dbProject.pictures) {
                dbProject.pictures = [];
            }

            for (const picture of updatedProject.newPictures) {
                const optimizedPicture = await this.picturesService.optimizeGalleryImage(
                    {
                        data: picture.buffer,
                        type: picture.mimetype as MimeTypesEnum,
                    },
                );

                dbProject.pictures.push(
                    await this.s3ImageManagementService.uploadImageToS3(
                        optimizedPicture.data,
                        optimizedPicture.type,
                        dbProject.id,
                    ),
                );

                // Delete previous images if we reach the limit
                if (
                    dbProject.pictures.length >
                    UpdateProjectService.MAX_PICTURES_SIZE
                ) {
                    const oldestImage = dbProject.pictures[0];

                    await this.s3ImageManagementService.deleteFileOnS3(
                        oldestImage,
                    );

                    dbProject.pictures.splice(0, 1);
                }
            }
        }

        if (updatedProject.logo) {
            if (dbProject.logo) {
                await this.s3ImageManagementService.deleteFileOnS3(
                    dbProject.logo,
                );
            }

            const optimizedLogo = await this.picturesService.optimizeLogo({
                data: updatedProject.logo[0].buffer,
                type: updatedProject.logo[0].mimetype as MimeTypesEnum,
            });

            dbProject.logo = await this.s3ImageManagementService.uploadImageToS3(
                optimizedLogo.data,
                optimizedLogo.type,
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
