import { SupportedNetworksEnum } from '../../../database/enums/supported-networks.enum';

export class ChainedAddress {
    public network: SupportedNetworksEnum;
    public address: string;

    constructor(attributes: Partial<ChainedAddress>) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
