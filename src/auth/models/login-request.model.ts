import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
    @ApiProperty()
    @IsNotEmpty()
    signature: string;

    @ApiProperty()
    @IsNotEmpty()
    timestamp: Date;

    @ApiProperty()
    @IsNotEmpty()
    wallet: string;

    constructor(signature: string, timestamp: Date, wallet: string) {
        this.signature = signature;
        this.timestamp = timestamp;
        this.wallet = wallet;
    }
}
