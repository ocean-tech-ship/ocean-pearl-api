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
import { AuthService } from './auth.service';
import {
    AuthenticatedUser,
    LoginRequest,
    RefreshJwtPayload,
} from './auth.interface';
import { Request, Response } from 'express';
import { VerifyLoginService } from './verify-login/verify-login.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import { SessionRepository } from '../database/repositories/session.repository';
import { hash } from 'bcrypt';
import { Session } from '../database/schemas/session.schema';

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
            throw new UnauthorizedException(
                { i18n: 'auth.error.signature' },
                'Invalid Wallet Signature',
            );
        }

        if (!this.verifyLoginService.verifyTimestamp(request)) {
            this.authService.clearJwtCookies(res);
            throw new UnauthorizedException(
                { i18n: 'auth.error.timestamp' },
                'The signed request timed out',
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

        // Delete previous refresh token
        await this.sessionRepository.deleteByWalletAddressAndCreatedAt(
            user.wallet,
            user.createdAt,
        );

        this.authService.createAccessToken(user, res);
        const refreshToken = this.authService.createRefreshToken(user, res);

        await this.sessionRepository.create(<Session>{
            createdAt: refreshToken.payload.createdAt,
            walletAddress: refreshToken.payload.wallet,
            hashedToken: await hash(refreshToken.jwt, 10),
        });

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
