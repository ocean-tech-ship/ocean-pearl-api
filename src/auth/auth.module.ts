import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { VerifyLoginService } from './services/verify-login.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        PassportModule.register({
            property: 'user',
            session: false,
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_LIFETIME'),
                },
            }),
        }),
    ],
    providers: [AuthService, VerifyLoginService, JwtStrategy],
    exports: [PassportModule, JwtModule, VerifyLoginService, AuthService],
})
export class AuthModule {}
