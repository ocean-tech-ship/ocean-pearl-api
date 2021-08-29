import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from '../../auth/models/authenticated-user.model';

@ApiTags('account')
@Controller('account')
export class AccountController {
    @Get()
    @UseGuards(AuthGuard())
    getProjects(@Req() req: Request) {
        const user = req.user as AuthenticatedUser;
        // TODO: fill with attached projects
        return {
            wallet: user.wallet,
            projects: [],
        };
    }
}
