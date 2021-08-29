import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { AccessJwtPayload } from '../interfaces/auth.interface';
import { AuthenticatedUser } from '../models/authenticated-user.model';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    'jwt-access',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.[AuthService.SESSION_NAME_ACCESS];
                },
            ]),
        });
    }

    async validate(payload: AccessJwtPayload): Promise<AuthenticatedUser> {
        if (payload === null) {
            throw new UnauthorizedException();
        }

        // We might fetch additional user data for the AuthenticatedUser object
        return payload;
    }
}
