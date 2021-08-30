import { ApiProperty } from '@nestjs/swagger';
import { JwtTokenPayload } from '../interfaces/auth.interface';

/* this is our user which will be available on all protected endpoints */
export class AuthenticatedUser implements JwtTokenPayload {
    @ApiProperty()
    wallet: string;

    @ApiProperty()
    createdAt: Date;
}
