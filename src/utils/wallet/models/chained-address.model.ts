import { Transform } from 'class-transformer';
import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';
import { formatAddress } from '../services/address-format.service';

export class ChainedAddress {
    public network: SupportedNetworksEnum;
    @Transform(({ value }) => formatAddress(value))
    public address: string;

    constructor(attributes: Partial<ChainedAddress>) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
