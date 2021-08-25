import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from '../database/repositories/session.repository';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedUser, RefreshJwtPayload } from './auth.interface';
import { compare } from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly sessionRepository: SessionRepository,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.[AuthService.SESSION_NAME_REFRESH];
                },
            ]),
        });
    }

    async validate(
        request: Request,
        payload: RefreshJwtPayload,
    ): Promise<AuthenticatedUser> {
        const token = request?.cookies?.[AuthService.SESSION_NAME_REFRESH];

        const session = await this.sessionRepository.getByWalletAddressAndCreatedAt(
            payload.wallet,
            payload.createdAt,
        );

        if (session && (await compare(token, session.hashedToken))) {
            return { wallet: payload.wallet };
        }

        throw new UnauthorizedException();
    }
}
