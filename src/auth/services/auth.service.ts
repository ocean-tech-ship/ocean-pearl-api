import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtToken, JwtTokenPayload } from '../interfaces/auth.interface';
import { VerifyLoginService } from './verify-login.service';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly jwtService: JwtService,
    ) {}

    public static readonly SESSION_NAME = 'session';

    public createToken(user: AuthenticatedUser, res?: Response): JwtToken {
        const payload = <JwtTokenPayload>user;
        const jwt = this.jwtService.sign(payload);

        res?.cookie(AuthService.SESSION_NAME, jwt, this.createCookieOptions());

        return { payload, jwt };
    }

    public clearToken(res: Response) {
        res.clearCookie(AuthService.SESSION_NAME, this.createCookieOptions(-1));
    }

    private createCookieOptions(lifetime?: number): CookieOptions {
        return {
            maxAge:
                lifetime ||
                Number(this.configService.get<string>('JWT_LIFETIME')) / 1000,
            httpOnly: true,
            secure:
                this.configService.get<string>('JWT_HTTPS').toLowerCase() ===
                'true',
            sameSite: 'strict',
            path: '/',
        };
    }
}
