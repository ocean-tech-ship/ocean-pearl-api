import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';

@Injectable()
export class ProjectGuard implements CanActivate {
    public constructor(private projectRepository: ProjectRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !request.Body.id) {
            throw new UnauthorizedException();
        }

        const project = await this.projectRepository.findOne({
            find: { id: request.Body.id },
        });

        if (project?.accessAddresses?.includes(user.wallet.toLowerCase())) {
            return true;
        }

        throw new UnauthorizedException();
    }
}
