import { Transform } from 'class-transformer';
import { formatAddress } from '../services/address-format.service';

export class WalletInfo {
    public balance = 0;
    @Transform(({ value }) => formatAddress(value))
    public address: string;

    constructor(attributes: Partial<WalletInfo> = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
