import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../database/repositories/post.repository';
import { Post } from '../../database/schemas/post.schema';

@Injectable()
export class LatestPostsService {
    constructor(private postRepository: PostRepository) {}

    public async execute(): Promise<Post[]> {
        const model = this.postRepository.getModel();

        return model
            .find()
            .sort({ createdAt: -1 })
            .limit(3)
            .lean()
            .populate({
                path: 'project',
                select: '-daoProposals -_id -__v',
                populate: [
                    {
                        path: 'logo',
                        select: '-_id -__v',
                    },
                    {
                        path: 'images',
                        select: '-_id -__v',
                    },
                ],
            })
            .select('-_id -__v')
            .exec();
    }
}
