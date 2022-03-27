import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCryptoAddress {
    @ApiProperty({
        default: 'Add the network e.g. ethereum.',
    })
    @IsString()
    @Length(0, 128)
    network: string;

    @ApiProperty({
        default: 'Add the address.',
    })
    @IsString()
    @Length(0, 64)
    address: string;
}