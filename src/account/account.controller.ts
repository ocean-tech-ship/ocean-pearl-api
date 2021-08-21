import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedUser } from '../auth/auth.interface';

@Controller('account')
export class AccountController {
    @Get()
    @UseGuards(AuthGuard())
    getProjects(@Req() req: Request) {
        const user = req.user as AuthenticatedUser;
        return {
            wallet: user.wallet,
        };
    }
}
