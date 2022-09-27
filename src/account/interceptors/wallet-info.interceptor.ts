import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { WalletInfoService } from '../../utils/wallet/services/wallet-info.service';

@Injectable()
export class WalletInfoInterceptor implements NestInterceptor {
    public constructor(private walletInfoService: WalletInfoService) {}

    public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const user: AuthenticatedUser = request.user as AuthenticatedUser;
        const walletInfo: WalletInfo = await this.walletInfoService.getCompleteInfo(user.wallet);

        request.walletInfo = walletInfo;
        return next.handle();
    }
}
