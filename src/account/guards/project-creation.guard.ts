import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { WalletInfoService } from '../../utils/wallet/services/wallet-info.service';

@Injectable()
export class ProjectCreationGuard implements CanActivate {
    private readonly maxProjectAmount = 6;
    private readonly minOceanAmount = 500;

    public constructor(
        private projectRepository: ProjectRepository,
        private walletInfoService: WalletInfoService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (await this.projectRepository.getModel().exists({ title: request.body.title })) {
            new BadRequestException('The name for the Project is already taken.');
        }

        const walletInfo = await this.walletInfoService.getCompleteInfo(user.wallet);
        const createdProjects = await this.projectRepository.getAll({
            find: {
                'author.address': user.wallet.toLocaleLowerCase(),
            },
        });

        if (walletInfo.balance < this.minOceanAmount) {
            throw new ForbiddenException(
                `Users need at least ${this.minOceanAmount}OCEAN on the Mainnet, Polygon or BSC.`,
            );
        }

        if (createdProjects.length >= this.maxProjectAmount) {
            throw new ForbiddenException(
                `Users can only create up to ${this.maxProjectAmount} projects.`,
            );
        }

        request.wallatInfo = walletInfo;

        return true;
    }
}
