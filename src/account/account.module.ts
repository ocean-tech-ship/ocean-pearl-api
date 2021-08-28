import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [AuthModule],
    controllers: [AccountController, AuthController],
})
export class AccountModule {}
