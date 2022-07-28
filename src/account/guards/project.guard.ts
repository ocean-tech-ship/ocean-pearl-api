import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { CryptoAddress } from '../../database/schemas/crypto-address.schema';

@Injectable()
export class ProjectGuard implements CanActivate {
    public constructor(private projectRepository: ProjectRepository) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !request.body.id) {
            throw new UnauthorizedException();
        }

        const project = await this.projectRepository.findOne({
            find: { id: request.body.id },
        });

        if (
            project?.accessAddresses?.find(
                (cryptoAddress: CryptoAddress) =>
                    cryptoAddress.address === user.wallet.toLowerCase(),
            )
        ) {
            return true;
        }

        throw new UnauthorizedException();
    }
}
