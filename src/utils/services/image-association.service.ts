import { Injectable } from '@nestjs/common';
import { ImageRepository } from '../../database/repositories/image.repository';

@Injectable()
export class ImageAssociationService {
    public constructor(private imageRepository: ImageRepository) {}

    public isProjectPictureOwner(): boolean {
        return true;
    }

    public isImageUnassociated(): boolean {
        return true;
    }
}