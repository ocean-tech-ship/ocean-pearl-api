import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser, JwtPayload } from './auth.interface';
import { VerifyLoginService } from './verify-login/verify-login.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly jwtService: JwtService,
    ) {}

    public static readonly SESSION_NAME = 'session';
    public static readonly SESSION_SHADOW_NAME = 'session-shadow';

    public applyJwtCookies(user: AuthenticatedUser, res: Response) {
        const payload: JwtPayload = { wallet: user.wallet };

        const lifetime = Number(this.configService.get('JWT_LIFETIME'));
        const expireDate = new Date(Date.now() + lifetime);

        const accessToken = this.jwtService.sign(payload);

        // TODO: other options
        res.cookie(AuthService.SESSION_NAME, accessToken, {
            expires: expireDate,
        });

        // TODO: other options
        res.cookie(AuthService.SESSION_SHADOW_NAME, String(expireDate), {
            expires: expireDate,
        });
    }

    public clearJwtCookies(res: Response) {
        // TODO: other options
        res.clearCookie(AuthService.SESSION_NAME);
        res.clearCookie(AuthService.SESSION_SHADOW_NAME);
    }
}
