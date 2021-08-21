import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser, JwtPayload } from './auth.interface';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.[AuthService.SESSION_NAME];
                },
            ]),
        });
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        if (payload === null) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
