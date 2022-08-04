import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedNetworksEnum } from '../enums/supported-networks.enum';

@Schema({ _id: false })
export class CryptoAddress {
    @Prop({
        type: String,
        enum: SupportedNetworksEnum,
        default: SupportedNetworksEnum.Mainnet,
        required: true,
    })
    @ApiProperty()
    network: SupportedNetworksEnum = SupportedNetworksEnum.Mainnet;

    @Prop({
        type: String,
        maxLength: 64,
        required: true,
    })
    @ApiProperty()
    address: string;

    public constructor(attributes: Partial<CryptoAddress> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}

export const CryptoAddressSchema = SchemaFactory.createForClass(CryptoAddress);
