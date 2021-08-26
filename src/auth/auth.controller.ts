import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
    AuthenticatedUser,
    LoginRequest,
    RefreshJwtPayload,
} from './interfaces/auth.interface';
import { Request, Response } from 'express';
import { VerifyLoginService } from './services/verify-login.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { SessionRepository } from '../database/repositories/session.repository';
import { hash } from 'bcrypt';
import { Session } from '../database/schemas/session.schema';
import { I18nHttpException } from '../util/i18n-http.exception';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly sessionRepository: SessionRepository,
    ) {}

    @Post('login')
    async login(@Body() request: LoginRequest, @Res() res: Response) {
        if (!this.verifyLoginService.verifySignature(request)) {
            this.authService.clearJwtCookies(res);

            throw new I18nHttpException(
                new UnauthorizedException(
                    'Unauthorized',
                    'Invalid wallet signature',
                ),
                'auth.error.signature',
            );
        }

        if (!this.verifyLoginService.verifyTimestamp(request)) {
            this.authService.clearJwtCookies(res);

            throw new I18nHttpException(
                new UnauthorizedException(
                    'Unauthorized',
                    'The signed request timed out',
                ),
                'auth.error.timestamp',
            );
        }

        const user: AuthenticatedUser = { wallet: request.wallet };

        this.authService.createAccessToken(user, res);
        const refreshToken = this.authService.createRefreshToken(user, res);

        await this.sessionRepository.create(<Session>{
            createdAt: refreshToken.payload.createdAt,
            walletAddress: refreshToken.payload.wallet,
            hashedToken: await hash(refreshToken.jwt, 10),
        });

        res.status(HttpStatus.CREATED).send();
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const user = req.user as RefreshJwtPayload;

        const session = await this.sessionRepository.getByWalletAddressAndCreatedAt(
            user.wallet,
            user.createdAt,
        );

        // Reset timeout timer
        session.updatedAt = new Date();
        await this.sessionRepository.update(session);

        this.authService.createAccessToken(user, res);
        this.authService.renewRefreshToken(session, res);

        res.status(HttpStatus.OK).send();
    }

    @Post('logout')
    @UseGuards(JwtRefreshGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as RefreshJwtPayload;

        await this.sessionRepository.deleteByWalletAddressAndCreatedAt(
            user.wallet,
            user.createdAt,
        );

        this.authService.clearJwtCookies(res);

        res.status(HttpStatus.OK).send();
    }
}
