import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionRepository } from '../../database/repositories/session.repository';
import { JwtTokenPayload } from '../interfaces/auth.interface';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { AuthService } from '../services/auth.service';

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
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('JWT_SECRET'),

            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.[AuthService.SESSION_NAME];
                },
            ]),
        });
    }

    async validate(
        request: Request,
        payload: JwtTokenPayload,
    ): Promise<AuthenticatedUser> {
        const token = request?.cookies?.[AuthService.SESSION_NAME];

        const session = await this.sessionRepository.findOne({
            find: {
                walletAddress: payload.wallet,
                createdAt: payload.createdAt,
            },
        });

        if (session && (await compare(token, session.hashedToken))) {
            // Refresh the session
            session.updatedAt = new Date();
            await this.sessionRepository.update(session);

            this.authService.createToken(
                { wallet: payload.wallet, createdAt: payload.createdAt },
                request.res,
            );

            // We might fetch additional user data for the AuthenticatedUser object
            return <AuthenticatedUser>payload;
        }

        throw new UnauthorizedException();
    }
}
