import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';

@Injectable()
export class ProjectGuard implements CanActivate {
    public constructor(private projectRepository: ProjectRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.body.id;

        console.log(user, request.body);
        console.log(request);

        if (!user || !projectId) {
            throw new UnauthorizedException();
        }

        const projects = await this.projectRepository.getAll({
            find: { accessWallets: user.wallet },
        });

        console.log(projects)

        for (const project of projects) {
            if (
                project.id === projectId &&
                project.accessAddresses.includes(user.wallet)
            ) {
                return true;
            }
        }

        throw new UnauthorizedException();
    }
}
