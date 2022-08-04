import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WalletInfoParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.walletInfo;
  },
);