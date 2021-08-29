import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from '../../database/repositories/session.repository';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { RefreshJwtPayload } from '../interfaces/auth.interface';
import { compare } from 'bcrypt';
import { Session } from '../../database/schemas/session.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly sessionRepository: SessionRepository,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    // We clear all auth cookies for unauthorized cases
                    this.authService.clearJwtCookies(request.res);

                    return request?.cookies?.[AuthService.SESSION_NAME_REFRESH];
                },
            ]),
        });
    }

    async validate(
        request: Request,
        payload: RefreshJwtPayload,
    ): Promise<RefreshJwtPayload> {
        const token = request?.cookies?.[AuthService.SESSION_NAME_REFRESH];

        const session = await this.sessionRepository.findOne({
            find: {
                walletAddress: payload.wallet,
                createdAt: payload.createdAt,
            },
        });

        if (session && (await compare(token, session.hashedToken))) {
            if (this._validateTimeout(session)) {
                // We will just return the plain payload for refresh strategies
                return payload;
            }

            // session timeout detected - delete refresh token manually
            await this.sessionRepository.deleteByWalletAddressAndCreatedAt(
                payload.wallet,
                payload.createdAt,
            );
        }

        throw new UnauthorizedException();
    }

    _validateTimeout(session: Session): boolean {
        const lifetime = this.configService.get<string>('JWT_REFRESH_LIFETIME');
        const updatedAt = new Date(session.updatedAt).getTime();
        return Date.now() < updatedAt + Number(lifetime);
    }
}
