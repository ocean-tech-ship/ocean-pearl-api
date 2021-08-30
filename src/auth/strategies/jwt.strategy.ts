import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedUser } from '../models/authenticated-user.model';
import { JwtTokenPayload } from '../interfaces/auth.interface';

/* Note: this strategy does not validate expiration (db & timestamp) */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            ignoreExpiration: true,
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
        return { wallet: payload.wallet, createdAt: payload.createdAt };
    }
}
