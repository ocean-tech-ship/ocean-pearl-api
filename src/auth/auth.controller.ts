import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './auth.interface';
import { Response } from 'express';
import { VerifyLoginService } from './verify-login/verify-login.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly verifyLoginService: VerifyLoginService,
    ) {}

    @Post('login')
    login(@Body() request: LoginRequest, @Res() res: Response) {
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

        this.authService.applyJwtCookies({ wallet: request.wallet }, res);
        res.status(HttpStatus.CREATED).send();
    }

    @Post('logout')
    logout(@Res() res: Response) {
        this.authService.clearJwtCookies(res);
        res.status(HttpStatus.OK).send();
    }
}
