/* this is our user which will be available on all protected endpoints (access-token) */
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUser {
    @ApiProperty()
    wallet: string;
}
