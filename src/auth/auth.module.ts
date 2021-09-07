import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { VerifyLoginService } from './services/verify-login.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        PassportModule.register({
            property: 'user',
            session: false,
            defaultStrategy: 'jwt-refresh',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_TIME_TO_LIVE'),
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        VerifyLoginService,
        JwtStrategy,
        JwtRefreshStrategy,
    ],
    exports: [PassportModule, JwtModule, VerifyLoginService, AuthService],
})
export class AuthModule {}
