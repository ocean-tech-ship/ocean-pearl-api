import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { SupportedNetworksEnum } from '../../database/enums/supported-networks.enum';

export class CreateCryptoAddress {
    @ApiProperty({
        default: SupportedNetworksEnum.Mainnet,
        type: String,
        enum: SupportedNetworksEnum
    })
    @IsEnum(SupportedNetworksEnum)
    @IsString()
    @Length(0, 128)
    network: SupportedNetworksEnum;

    @ApiProperty({
        default: 'Add the address.',
    })
    @IsString()
    @Length(0, 64)
    address: string;
}