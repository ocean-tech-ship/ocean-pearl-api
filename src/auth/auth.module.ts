import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { VerifyLoginService } from './verify-login/verify-login.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({
            defaultStrategy: 'jwt-access',
            property: 'user',
            session: false,
        }),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        VerifyLoginService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
    exports: [PassportModule, JwtModule],
})
export class AuthModule {}
