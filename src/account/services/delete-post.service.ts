import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostRepository } from '../../database/repositories/post.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { Post } from '../../database/schemas/post.schema';

@Injectable()
export class DeletePostService {
    public constructor(
        private postRepository: PostRepository,
        private projectRepository: ProjectRepository,
    ) {}

    public async execute(post: Post): Promise<void> {
        const linkedProject = await this.projectRepository.findOneRaw({
            find: {
                _id: post.project,
            },
        });

        linkedProject.posts = linkedProject.posts as Types.ObjectId[];
        linkedProject.posts = linkedProject.posts.filter(
            (postId: Types.ObjectId) => postId.toHexString() !== post._id.toHexString(),
        );

        if (linkedProject.posts.length === 0) {
            linkedProject.posts = null;
        }

        await this.projectRepository.update(linkedProject);
        await this.postRepository.delete({
            find: {
                _id: post._id,
            },
        });
    }
}
