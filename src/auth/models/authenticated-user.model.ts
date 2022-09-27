import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { formatAddress } from '../../utils/wallet/services/address-format.service';
import { JwtTokenPayload } from '../interfaces/auth.interface';

/* this is our user which will be available on all protected endpoints */
export class AuthenticatedUser implements JwtTokenPayload {
    @ApiProperty()
    @Transform(({ value }) => formatAddress(value))
    wallet: string;

    @ApiProperty()
    createdAt: Date;
}
