import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { formatAddress } from '../../utils/wallet/services/address-format.service';

export class LoginRequest {
    @ApiProperty()
    @IsNotEmpty()
    signature: string;

    @ApiProperty()
    @IsNotEmpty()
    timestamp: Date;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => formatAddress(value))
    wallet: string;

    constructor(signature: string, timestamp: Date, wallet: string) {
        this.signature = signature;
        this.timestamp = timestamp;
        this.wallet = wallet;
    }
}
