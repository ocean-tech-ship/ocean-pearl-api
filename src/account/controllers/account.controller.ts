import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/interfaces/auth.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('account')
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
