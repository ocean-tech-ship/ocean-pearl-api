import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    AccessJwtPayload,
    AuthenticatedUser,
    JwtToken,
    RefreshJwtPayload,
} from './auth.interface';
import { VerifyLoginService } from './verify-login/verify-login.service';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly jwtService: JwtService,
    ) {}

    public static readonly SESSION_NAME_ACCESS = 'token-access';
    public static readonly SESSION_NAME_REFRESH = 'token-refresh';

    public createAccessToken(
        user: AuthenticatedUser,
        res: Response,
    ): JwtToken<AccessJwtPayload> {
        const payload: AccessJwtPayload = { wallet: user.wallet };

        const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
        const lifetime = this.configService.get<string>('JWT_ACCESS_LIFETIME');

        const jwt = this.jwtService.sign(payload, {
            secret: secret,
            expiresIn: lifetime,
        });

        res.cookie(
            AuthService.SESSION_NAME_ACCESS,
            jwt,
            this.createCookieOptions(Number(lifetime)),
        );

        return { payload, jwt };
    }

    public createRefreshToken(
        user: AuthenticatedUser,
        res: Response,
    ): JwtToken<RefreshJwtPayload> {
        const payload: RefreshJwtPayload = {
            wallet: user.wallet,
            createdAt: new Date(),
        };

        const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
        const lifetime = this.configService.get<string>('JWT_REFRESH_LIFETIME');

        const jwt = this.jwtService.sign(payload, {
            secret: secret,
            expiresIn: lifetime,
        });

        res.cookie(
            AuthService.SESSION_NAME_REFRESH,
            jwt,
            this.createCookieOptions(Number(lifetime)),
        );

        return { payload, jwt };
    }

    public clearJwtCookies(res: Response) {
        res.clearCookie(AuthService.SESSION_NAME_ACCESS);
        res.clearCookie(AuthService.SESSION_NAME_REFRESH);
    }

    private createCookieOptions(lifetime: number): CookieOptions {
        return {
            expires: new Date(Date.now() + lifetime),
            httpOnly: true,
            secure: this.configService.get<boolean>('JWT_HTTPS'),
            sameSite: 'strict',
            path: '/',
        };
    }
}
