import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { PostRepository } from '../../database/repositories/post.repository';
import { Post } from '../../database/schemas/post.schema';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { NewPost } from '../models/new-post.model';
import { Types } from 'mongoose';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ImageAssociationService } from '../../utils/image/services/image-association.service';
import { LinkedImage } from '../models/linked-project.model';

@Injectable()
export class CreatePostService {
    public constructor(
        private postRepository: PostRepository,
        private projectRepository: ProjectRepository,
        private imageRepository: ImageRepository,
        private imageAssociationService: ImageAssociationService,
    ) {}

    public async execute(post: NewPost, author: WalletInfo): Promise<void> {
        const linkedProject = await this.projectRepository.findOneRaw({
            find: {
                id: post.project,
            },
        });

        if (!linkedProject) {
            throw new BadRequestException('No Project for the given id.');
        }

        if (!linkedProject.accessAddresses.includes(author.address)) {
            throw new UnauthorizedException();
        }

        const newPost: Post = new Post({
            title: post.title,
            text: post.text,
            project: linkedProject._id,
            author: author.address,
        });

        if (post.images && post.images.length > 0) {
            newPost.images = newPost.images as Types.ObjectId[];
            newPost.images = await this.addImages(post.images);
        }

        await this.postRepository.create(newPost);
        return;
    }

    private async addImages(newImages: LinkedImage[]): Promise<Types.ObjectId[]> {
        const newImageIds: Types.ObjectId[] = [];

        for (const image of newImages) {
            const newImage = await this.imageRepository.findOneRaw({
                find: { id: image.id },
            });

            if (!(await this.imageAssociationService.isImageUnassociated(newImage))) {
                throw new UnauthorizedException(
                    'Image is already used by another entity.',
                );
            }

            newImageIds.push(newImage._id);
        }

        return newImageIds;
    }
}
