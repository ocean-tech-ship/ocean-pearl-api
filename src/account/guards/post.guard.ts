import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostRepository } from '../../database/repositories/post.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';

@Injectable()
export class PostGuard implements CanActivate {
    public constructor(
        private projectRepository: ProjectRepository,
        private postRepository: PostRepository,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const post = await this.postRepository.findOneRaw({
            find: {
                id: request.params.id,
            },
        });

        if (!post) {
            throw new NotFoundException();
        }

        const linkedProject = await this.projectRepository.findOne({
            find: {
                _id: post.project,
            },
        });

        if (!linkedProject.accessAddresses.includes(user.wallet)) {
            throw new UnauthorizedException()
        }

        request.post = post;

        return true;
    }
}
