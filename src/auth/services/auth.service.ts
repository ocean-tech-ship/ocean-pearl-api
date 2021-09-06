import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { JwtToken, JwtTokenPayload } from '../interfaces/auth.interface';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public static readonly SESSION_NAME = 'session';
    public static readonly SESSION_SHADOW_NAME = 'session-shadow';

    public createToken(user: AuthenticatedUser, res?: Response): JwtToken {
        const payload = <JwtTokenPayload>user;
        const jwt = this.jwtService.sign(payload);

        res?.cookie(
            AuthService.SESSION_NAME,
            jwt,
            this.createCookieOptions(true),
        );

        res?.cookie(
            AuthService.SESSION_SHADOW_NAME,
            user.wallet,
            this.createCookieOptions(false),
        );

        return { payload, jwt };
    }

    public clearToken(res: Response) {
        res.clearCookie(
            AuthService.SESSION_NAME,
            this.createCookieOptions(true, -1),
        );
        res.clearCookie(
            AuthService.SESSION_SHADOW_NAME,
            this.createCookieOptions(false, -1),
        );
    }

    private createCookieOptions(
        httpOnly: boolean,
        timeToLive?: number,
    ): CookieOptions {
        return {
            expires: timeToLive
                ? new Date(timeToLive)
                : new Date(
                      Date.now() +
                          Number(
                              this.configService.get<string>('JWT_TIME_TO_LIVE'),
                          ),
                  ),
            httpOnly: httpOnly,
            secure:
                this.configService.get<string>('JWT_HTTPS').toLowerCase() ===
                'true',
            sameSite: 'strict',
            path: '/',
        };
    }
}
