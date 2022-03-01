import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ProjectRepository } from '../../database/repositories/project.repository';

@Injectable()
export class ProjectCreationGuard implements CanActivate {
    public constructor(private projectRepository: ProjectRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = Object.assign(context.switchToHttp().getRequest<Request>());
        const response = Object.assign(context.switchToHttp().getResponse<Response>());
        await new Promise((resolve, reject) => {
            multer().any()(request, response, function (err) {
                if (err) reject(err);

                console.log('GUARD!');
                console.log(request);     
                resolve(request);
            });
        });

        return true;
        // throw new UnauthorizedException();
    }
}
