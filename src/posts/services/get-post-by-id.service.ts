import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../database/repositories/post.repository';
import { Post } from '../../database/schemas/post.schema';

@Injectable()
export class GetPostByIdService {
    constructor(private postRepository: PostRepository) {}

    public async execute(id: string): Promise<Post> {
        return await this.postRepository.getByID(id);
    }
}
