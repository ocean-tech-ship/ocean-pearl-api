import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [AuthModule, DatabaseModule],
    controllers: [AccountController, AuthController],
})
export class AccountModule {}
