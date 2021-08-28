import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty()
    signature: string;

    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    wallet: string;

    constructor(signature: string, timestamp: Date, wallet: string) {
        this.signature = signature;
        this.timestamp = timestamp;
        this.wallet = wallet;
    }
}
