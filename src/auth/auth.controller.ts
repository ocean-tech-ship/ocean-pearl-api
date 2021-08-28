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
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly sessionRepository: SessionRepository,
    ) {}

    @Post('login')
    @ApiCreatedResponse({
        description: 'Login via any supported crypto wallet',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid wallet signature or outdated request',
    })
    @ApiBody({
        required: true,
        type: LoginRequestDto,
    })
    async login(@Body() request: LoginRequest, @Res() res: Response) {
        if (!this.verifyLoginService.verifySignature(request)) {
            this.authService.clearJwtCookies(res);
            throw new UnauthorizedException('Invalid wallet signature');
        }

        if (!this.verifyLoginService.verifyTimestamp(request)) {
            this.authService.clearJwtCookies(res);
            throw new UnauthorizedException('The signed request timed out');
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
    @ApiOkResponse({
        description: 'Renews jwt access- and refresh-token',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid or outdated refresh token',
    })
    async refresh(@Req() req: Request, @Res() res: Response) {
        const user = req.user as RefreshJwtPayload;

        const session = await this.sessionRepository.findOne({
            find: {
                walletAddress: user.wallet,
                createdAt: user.createdAt,
            },
        });

        // Reset timeout timer
        session.updatedAt = new Date();
        await this.sessionRepository.update(session);

        this.authService.createAccessToken(user, res);
        this.authService.renewRefreshToken(session, res);

        res.status(HttpStatus.OK).send();
    }

    @Post('logout')
    @UseGuards(JwtRefreshGuard)
    @ApiOkResponse({
        description: 'Clears cookies and invalidates jwt refresh token',
    })
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
