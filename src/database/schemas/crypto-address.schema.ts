import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class CryptoAddress {
    @Prop({
        type: String,
        length: 128,
        required: true
    })
    @ApiProperty()
    network: string;

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
