import { Module } from '@nestjs/common';
import { VerifyLoginService } from './services/verify-login.service';

@Module({
    providers: [VerifyLoginService],
})
export class AccountModule {}
