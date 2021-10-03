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
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';
import { LoginRequest } from '../../auth/models/login-request.model';
import { AuthService } from '../../auth/services/auth.service';
import { VerifyLoginService } from '../../auth/services/verify-login.service';
import { SessionRepository } from '../../database/repositories/session.repository';
import { Session } from '../../database/schemas/session.schema';

@ApiTags('account')
@Controller('account')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly verifyLoginService: VerifyLoginService,
        private readonly sessionRepository: SessionRepository,
    ) {}

    @Post('login')
    @ApiCreatedResponse({
        description: 'Login via any supported crypto wallet',
        type: AuthenticatedUser,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid wallet signature or outdated request',
    })
    @ApiBody({
        required: true,
        type: LoginRequest,
    })
    async login(@Body() request: LoginRequest, @Res() res: Response) {
        if (!this.verifyLoginService.verifySignature(request)) {
            this.authService.clearToken(res);
            throw new UnauthorizedException('Invalid wallet signature');
        }

        if (!this.verifyLoginService.verifyTimestamp(request)) {
            this.authService.clearToken(res);
            throw new UnauthorizedException('The signed request timed out');
        }

        const user: AuthenticatedUser = {
            wallet: request.wallet,
            createdAt: new Date(),
        };

        const token = this.authService.createToken(user, res);

        await this.sessionRepository.create(<Session>{
            walletAddress: user.wallet,
            createdAt: user.createdAt,
            hashedToken: await hash(token.jwt, 10),
        });

        res.status(HttpStatus.CREATED).send(user);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({
        description: 'Clears and invalidates the session',
    })
    async logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as AuthenticatedUser;

        await this.sessionRepository.delete({
            find: {
                walletAddress: user.wallet,
                createdAt: user.createdAt,
            },
        });

        this.authService.clearToken(res);

        res.status(HttpStatus.OK).send();
    }
}
