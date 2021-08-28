import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { VerifyLoginService } from './services/verify-login.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        PassportModule.register({
            defaultStrategy: 'jwt-access',
            property: 'user',
            session: false,
        }),
        JwtModule.register({}),
    ],
    providers: [
        AuthService,
        VerifyLoginService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
    exports: [PassportModule, JwtModule, VerifyLoginService, AuthService],
})
export class AuthModule {}
