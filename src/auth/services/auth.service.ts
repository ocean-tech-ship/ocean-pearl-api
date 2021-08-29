import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    AccessJwtPayload,
    JwtToken,
    RefreshJwtPayload,
} from '../interfaces/auth.interface';
import { VerifyLoginService } from './verify-login.service';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Session } from '../../database/schemas/session.schema';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly jwtService: JwtService,
    ) {}

    public static readonly SESSION_NAME_ACCESS = 'access-token';
    public static readonly SESSION_NAME_REFRESH = 'refresh-token';

    public createAccessToken(
        user: AuthenticatedUser,
        res?: Response,
    ): JwtToken<AccessJwtPayload> {
        const payload: AccessJwtPayload = { wallet: user.wallet };

        const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
        const lifetime = this.configService.get<string>('JWT_ACCESS_LIFETIME');

        const jwt = this.jwtService.sign(payload, {
            secret: secret,
            expiresIn: lifetime,
        });

        res?.cookie(
            AuthService.SESSION_NAME_ACCESS,
            jwt,
            this.createCookieOptions(Number(lifetime)),
        );

        return { payload, jwt };
    }

    public createRefreshToken(
        user: AuthenticatedUser,
        res?: Response,
    ): JwtToken<RefreshJwtPayload> {
        const session: Session = <Session>{
            walletAddress: user.wallet,
            createdAt: new Date(),
        };
        return this.renewRefreshToken(session, res);
    }

    public renewRefreshToken(
        session: Session,
        res?: Response,
    ): JwtToken<RefreshJwtPayload> {
        const payload: RefreshJwtPayload = {
            wallet: session.walletAddress,
            createdAt: session.createdAt,
        };

        const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
        const lifetime = this.configService.get<string>('JWT_REFRESH_LIFETIME');

        const jwt = this.jwtService.sign(payload, {
            secret: secret,
            expiresIn: lifetime,
        });

        res?.cookie(
            AuthService.SESSION_NAME_REFRESH,
            jwt,
            this.createCookieOptions(Number(lifetime)),
        );

        return { payload, jwt };
    }

    public clearJwtCookies(res: Response) {
        res.clearCookie(
            AuthService.SESSION_NAME_ACCESS,
            this.createCookieOptions(-1),
        );
        res.clearCookie(
            AuthService.SESSION_NAME_REFRESH,
            this.createCookieOptions(-1),
        );
    }

    private createCookieOptions(
        lifetime: number,
        path?: string,
    ): CookieOptions {
        return {
            expires: lifetime < 1 ? null : new Date(Date.now() + lifetime),
            httpOnly: true,
            secure:
                this.configService.get<string>('JWT_HTTPS').toLowerCase() ===
                'true',
            sameSite: 'strict',
            path: path || '/',
        };
    }
}
